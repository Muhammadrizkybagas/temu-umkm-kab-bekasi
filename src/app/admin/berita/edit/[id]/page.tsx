"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { updateNews } from "../../actions"; 
import Icon from "@mdi/react";
import {
  mdiFormatBold, 
  mdiFormatItalic, 
  mdiFormatUnderline, 
  mdiFormatStrikethrough,
  mdiFormatListBulleted, 
  mdiFormatListNumbered, 
  mdiLink, 
  mdiClose, 
  mdiContentSave, 
  mdiFormatAlignLeft, 
  mdiFormatAlignCenter,
  mdiFormatAlignRight, 
  mdiFormatAlignJustify, 
  mdiFormatQuoteClose,
  mdiImagePlus, 
  mdiFormatSuperscript, 
  mdiFormatSubscript,
  mdiImageOutline,
  mdiAccountEditOutline,
  mdiFileDocumentEditOutline,
} from "@mdi/js";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

export default function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [editorName, setEditorName] = useState("");
  const [status, setStatus] = useState("Draft");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      Subscript,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapLink.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline cursor-pointer" } }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "w-full p-5 text-sm text-gray-800 bg-white outline-none min-h-[350px] max-h-[600px] overflow-y-auto leading-relaxed focus:ring-0 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_p]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4",
      },
    },
  });

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`/api/admin/news/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data berita");
        const data = await res.json();
        
        setTitle(data.title || "");
        setEditorName(data.editor || "");
        setStatus(data.status || "Draft");
        if (data.thumbnailUrl) {
          setThumbnailPreview(data.thumbnailUrl);
        }
        
        if (editor) {
          editor.commands.setContent(data.content || "");
        }
      } catch {
        Swal.fire("Error", "Berita tidak ditemukan!", "error");
        router.push("/admin/berita");
      } finally {
        setLoading(false);
      }
    };

    if (editor) {
      fetchNewsDetail();
    }
  }, [id, router, editor]);

  const handleLink = () => {
    if (!editor) return;
    const url = window.prompt("Masukkan URL tautan (contoh: google.com):", editor.getAttributes("link").href);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const secureUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: secureUrl }).run();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Peringatan", "Ukuran gambar maksimal 2MB!", "warning");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      editor.chain().focus().setImage({ src: event.target?.result as string }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire("Peringatan", "Ukuran thumbnail maksimal 2MB!", "warning");
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML() || "";

    if (!title.trim() || !content.trim() || content === "<p></p>") {
      Swal.fire("Peringatan", "Judul dan Isi Artikel wajib diisi!", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("editor", editorName);
      formData.append("status", status);
      
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const res = await updateNews(id, formData);

      if (res.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Perubahan berita berhasil disimpan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin/berita");
      } else {
        Swal.fire("Gagal!", res.error || "Gagal menyimpan artikel.", "error");
      }
    } catch {
      Swal.fire("Error!", "Terjadi kesalahan pada server.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Memuat data artikel...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-16">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Artikel Berita</h1>
          <p className="text-sm text-gray-500">Perbarui informasi, konten, atau status publikasi artikel.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* main content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 text-gray-800 font-semibold">
            <Icon path={mdiFileDocumentEditOutline} size={1} className="text-primary" />
            <span>Konten Artikel</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Judul Artikel <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul..."
              className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Isi Artikel <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              
              {editor && (
                <div className="bg-gray-50/80 border-b border-gray-200 px-3 py-2.5 flex flex-wrap items-center gap-1.5 md:gap-2 text-gray-700 sticky top-0 z-10">
                  <select onChange={(e) => {
                    const val = e.target.value;
                    if (val === "p") editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
                  }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none bg-white font-medium text-gray-700">
                    <option value="p">Paragraph</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                  </select>

                  <span className="w-px h-5 bg-gray-300 mx-1"></span>

                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Bold"><Icon path={mdiFormatBold} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Italic"><Icon path={mdiFormatItalic} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("underline") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Underline"><Icon path={mdiFormatUnderline} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("strike") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Strikethrough"><Icon path={mdiFormatStrikethrough} size={0.7} /></button>

                  <span className="w-px h-5 bg-gray-300 mx-1 hidden md:block"></span>

                  <div className="flex bg-gray-200/60 rounded-lg p-0.5">
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1 rounded-md transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-white shadow-sm text-primary' : 'hover:text-gray-900'}`}><Icon path={mdiFormatAlignLeft} size={0.65} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1 rounded-md transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-white shadow-sm text-primary' : 'hover:text-gray-900'}`}><Icon path={mdiFormatAlignCenter} size={0.65} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1 rounded-md transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-white shadow-sm text-primary' : 'hover:text-gray-900'}`}><Icon path={mdiFormatAlignRight} size={0.65} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-1 rounded-md transition-all ${editor.isActive({ textAlign: 'justify' }) ? 'bg-white shadow-sm text-primary' : 'hover:text-gray-900'}`}><Icon path={mdiFormatAlignJustify} size={0.65} /></button>
                  </div>

                  <span className="w-px h-5 bg-gray-300 mx-1 hidden lg:block"></span>

                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Bullet List"><Icon path={mdiFormatListBulleted} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Numbered List"><Icon path={mdiFormatListNumbered} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("blockquote") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Blockquote"><Icon path={mdiFormatQuoteClose} size={0.7} /></button>

                  <span className="w-px h-5 bg-gray-300 mx-1 hidden lg:block"></span>

                  <button type="button" onClick={handleLink} className={`p-1.5 rounded-lg transition-colors ${editor.isActive("link") ? "bg-primary text-white shadow-sm" : "hover:bg-gray-200"}`} title="Insert Link"><Icon path={mdiLink} size={0.7} /></button>
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1.5 hover:bg-gray-200 rounded-lg text-primary transition-colors flex items-center gap-1 font-medium text-xs px-2" title="Sisipkan Gambar"><Icon path={mdiImagePlus} size={0.7} /> Sisipkan Gambar</button>
                  <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
              )}

              <div className="grow flex flex-col">
                 <EditorContent editor={editor} className="grow cursor-text" />
              </div>
            </div>
          </div>
        </div>

        {/* setting */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 text-gray-800 font-semibold">
            <Icon path={mdiAccountEditOutline} size={1} className="text-primary" />
            <span>Pengaturan & Media Publikasi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Penulis / Editor</label>
              <input
                type="text"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                placeholder="Nama penulis..."
                className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Status Publikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              >
                <option value="Draft">Simpan sebagai Draft</option>
                <option value="Published">Publikasikan Sekarang</option>
                <option value="Inactive">Nonaktifkan Berita (Tidak Aktif)</option> 
              </select>
            </div>
          </div>

          {/* thumbanail */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Gambar Utama (Thumbnail)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50/60 border border-dashed border-gray-300 rounded-2xl">
              {thumbnailPreview ? (
                <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-28 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                  <Icon path={mdiImageOutline} size={1.2} />
                </div>
              )}
              <div className="space-y-1 grow">
                <p className="text-xs text-gray-500">Format yang didukung: JPG, PNG, WebP. Ukuran maksimal 2MB.</p>
                <label className="inline-block cursor-pointer bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold shadow-sm transition-all">
                  Pilih Berkas Baru
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                </label>
                {thumbnailFile ? (
                  <p className="text-xs font-medium text-primary mt-1">File baru terpilih: {thumbnailFile.name}</p>
                ) : (
                  <p className="text-xs font-medium text-gray-500 mt-1">Menggunakan gambar thumbnail saat ini.</p>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/berita" className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2">
            <Icon path={mdiClose} size={0.7} /> Batal
          </Link>
          <button type="submit" disabled={submitting} className="px-8 py-3 bg-primary hover:bg-[#2489b5] text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70">
            <Icon path={mdiContentSave} size={0.75} /> 
            {submitting ? "Memproses..." : "Simpan Perubahan"}
          </button>
        </div>

      </form>
    </div>
  );
}
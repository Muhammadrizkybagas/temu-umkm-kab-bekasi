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
  mdiLinkOff,
  mdiClose, 
  mdiContentSave, 
  mdiFormatAlignLeft, 
  mdiFormatAlignCenter,
  mdiFormatAlignRight, 
  mdiFormatAlignJustify, 
  mdiFormatQuoteClose,
  mdiCodeTags, 
  mdiImagePlus, 
  mdiFormatSuperscript, 
  mdiFormatSubscript,
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
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
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
        class: "w-full p-6 text-base text-gray-800 bg-white outline-none min-h-[400px] max-h-[700px] overflow-y-auto leading-relaxed focus:ring-0 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-4 [&_pre]:bg-gray-800 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-md [&_a]:text-blue-600 [&_a]:underline",
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
        setExistingThumbnailUrl(data.thumbnailUrl || null);
        
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

  if (loading) return <div className="p-8 text-center text-gray-400">Memuat data...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-secondary rounded-xl shadow-soft border border-gray-100 p-6 md:p-8">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-textMain">Edit Berita</h1>
          <p className="text-sm text-gray-500">Perbarui status, penulis, gambar, dan informasi artikel/berita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-textMain mb-2">Judul Artikel</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul..."
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-textMain mb-2">Isi Artikel</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
              {editor && (
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap items-center gap-1.5 md:gap-2 text-gray-700 sticky top-0 z-10 shadow-sm">
                  <select onChange={(e) => {
                    const val = e.target.value;
                    if (val === "p") editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
                  }} className="text-xs border border-gray-300 rounded px-2 py-1 outline-none bg-white">
                    <option value="p">Paragraph</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                  </select>
                  <span className="w-px h-5 bg-gray-300 mx-1"></span>
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Bold"><Icon path={mdiFormatBold} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Italic"><Icon path={mdiFormatItalic} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded ${editor.isActive("underline") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Underline"><Icon path={mdiFormatUnderline} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded ${editor.isActive("strike") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Strikethrough"><Icon path={mdiFormatStrikethrough} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`p-1.5 rounded ${editor.isActive("superscript") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Superscript"><Icon path={mdiFormatSuperscript} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={`p-1.5 rounded ${editor.isActive("subscript") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Subscript"><Icon path={mdiFormatSubscript} size={0.7} /></button>
                  <span className="w-px h-5 bg-gray-300 mx-1 hidden md:block"></span>
                  <div className="flex bg-gray-100 rounded p-0.5">
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}><Icon path={mdiFormatAlignLeft} size={0.7} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}><Icon path={mdiFormatAlignCenter} size={0.7} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}><Icon path={mdiFormatAlignRight} size={0.7} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}><Icon path={mdiFormatAlignJustify} size={0.7} /></button>
                  </div>
                  <span className="w-px h-5 bg-gray-300 mx-1 hidden lg:block"></span>
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded ${editor.isActive("bulletList") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Bullet List"><Icon path={mdiFormatListBulleted} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded ${editor.isActive("orderedList") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Numbered List"><Icon path={mdiFormatListNumbered} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded ${editor.isActive("blockquote") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Blockquote"><Icon path={mdiFormatQuoteClose} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-1.5 rounded ${editor.isActive("codeBlock") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Code Block"><Icon path={mdiCodeTags} size={0.7} /></button>
                  <span className="w-px h-5 bg-gray-300 mx-1 hidden lg:block"></span>
                  <button type="button" onClick={handleLink} className={`p-1.5 rounded ${editor.isActive("link") ? "text-blue-500 bg-blue-50" : "hover:bg-gray-200"}`} title="Insert Link"><Icon path={mdiLink} size={0.7} /></button>
                  <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30" title="Remove Link"><Icon path={mdiLinkOff} size={0.7} /></button>
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1.5 hover:bg-gray-200 rounded text-primary" title="Upload Gambar (Maks 2MB)"><Icon path={mdiImagePlus} size={0.7} /></button>
                  <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
              )}
              <div className="grow flex flex-col">
                 <EditorContent editor={editor} className="grow cursor-text" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-textMain mb-2">Penulis / Editor</label>
              <input
                type="text"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                placeholder="Nama penulis..."
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-textMain mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="Draft">Simpan sebagai Draft</option>
                <option value="Published">Publikasikan Sekarang</option>
                <option value="Inactive">Nonaktifkan Berita (Tidak Aktif)</option> 
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-textMain mb-2">Gambar Utama (Thumbnail)</label>
            <div className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-3">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded border border-gray-300 text-xs font-bold transition-colors">
                Pilih File Baru
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files) setThumbnailFile(e.target.files[0]); }} />
              </label>
              <span className="text-sm text-gray-500">
                {thumbnailFile ? thumbnailFile.name : existingThumbnailUrl ? "Menggunakan gambar lama" : "Belum ada file dipilih"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <Link href="/admin/berita" className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
              <Icon path={mdiClose} size={0.7} /> Batal
            </Link>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-primary hover:bg-[#2489b5] text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 disabled:opacity-70">
              <Icon path={mdiContentSave} size={0.75} /> 
              {submitting ? "Memproses..." : "Simpan Perubahan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
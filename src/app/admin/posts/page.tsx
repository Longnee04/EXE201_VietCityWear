"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Video,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "culture" | "travel" | "landmark" | "news";
  author: string;
  featuredImage: string | null;
  videoUrl: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  // filteredPosts is computed via useMemo below
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Form states for Add/Edit Modal
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "culture" as "culture" | "travel" | "landmark" | "news",
    content: "",
    cover_image: "/images/hanoi-banner.jpg",
    published: true,
  });

  const categories = [
    { value: "all", label: "Tất cả bài viết" },
    { value: "culture", label: "Văn hóa" },
    { value: "travel", label: "Du lịch" },
    { value: "landmark", label: "Địa danh" },
    { value: "news", label: "Tin tức" },
  ];

  // Load posts
  useEffect(() => {
    Promise.resolve().then(() => loadPosts());
  }, []);

  async function loadPosts() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedPosts: Post[] = data.map((b) => {
          const rawCat = (b.category || "culture").toLowerCase();
          const validCat: "culture" | "travel" | "landmark" | "news" =
            rawCat === "du lịch" || rawCat === "travel"
              ? "travel"
              : rawCat === "địa danh" || rawCat === "landmark"
              ? "landmark"
              : rawCat === "tin tức" || rawCat === "news"
              ? "news"
              : "culture";

          return {
            id: b.id,
            title: b.title,
            slug: b.slug || b.id,
            excerpt: b.content ? b.content.slice(0, 140) + "..." : "",
            content: b.content || "",
            category: validCat,
            author: "Admin VIET CITY WEAR",
            featuredImage: b.cover_image || "/images/hanoi-banner.jpg",
            videoUrl: null,
            tags: [b.category || "Văn hóa"],
            published: b.status === "Published",
            publishedAt: b.published_at || b.created_at,
            createdAt: b.created_at,
            updatedAt: b.created_at,
          };
        });
        setPosts(mappedPosts);
        setFilteredPosts(mappedPosts);
      } else {
        setPosts([]);
        setFilteredPosts([]);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter posts
  const filteredPosts = React.useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, posts]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      await supabase.from("blogs").delete().eq("id", id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert("Đã xóa bài viết thành công!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Có lỗi xảy ra khi xóa bài viết!");
    }
  };

  const handleTogglePublish = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const nextPublished = !post.published;
    const nextStatus = nextPublished ? "Published" : "Draft";

    try {
      await supabase
        .from("blogs")
        .update({ status: nextStatus, published_at: nextPublished ? new Date().toISOString() : null })
        .eq("id", id);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                published: nextPublished,
                publishedAt: nextPublished ? new Date().toISOString() : null,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "culture":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "travel":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "landmark":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "news":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.label || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-neutral-700" />
              <h1 className="text-xl font-bold text-neutral-900">Quản lý Bài viết</h1>
            </div>
            <p className="text-sm text-neutral-600">
              Thêm, sửa, xóa và cập nhật bài viết về văn hóa, du lịch và địa danh
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài viết mới</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="text-2xl font-bold text-neutral-900">{posts.length}</div>
          <div className="text-xs text-neutral-600 mt-1">Tổng bài viết</div>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="text-2xl font-bold text-emerald-600">
            {posts.filter((p) => p.published).length}
          </div>
          <div className="text-xs text-neutral-600 mt-1">Đã xuất bản</div>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="text-2xl font-bold text-amber-600">
            {posts.filter((p) => !p.published).length}
          </div>
          <div className="text-xs text-neutral-600 mt-1">Bản nháp</div>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="text-2xl font-bold text-neutral-900">{filteredPosts.length}</div>
          <div className="text-xs text-neutral-600 mt-1">Kết quả lọc</div>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-3" />
          <p className="text-sm text-neutral-600">Đang tải danh sách bài viết...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Không tìm thấy bài viết</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Thử thay đổi bộ lọc hoặc thêm bài viết mới
          </p>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài viết đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Bài viết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {post.featuredImage ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-semibold rounded-full"
                              >
                                <Tag className="w-2.5 h-2.5" />
                                {tag}
                              </span>
                            ))}
                            {post.videoUrl && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded-full">
                                <Video className="w-2.5 h-2.5" />
                                Video
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                          post.category
                        )}`}
                      >
                        {getCategoryLabel(post.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(post.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                          post.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.published ? "bg-emerald-600" : "bg-amber-600"
                          }`}
                        />
                        {post.published ? "Đã xuất bản" : "Bản nháp"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert("Xem bài viết: " + post.title)}
                          className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition"
                          title="Xem bài viết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setFormData({
                              title: post.title,
                              slug: post.slug,
                              category: post.category,
                              content: post.content,
                              cover_image: post.featuredImage || "/images/hanoi-banner.jpg",
                              published: post.published,
                            });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const generatedSlug =
                    formData.slug.trim() ||
                    formData.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "");

                  if (editingPost) {
                    await supabase
                      .from("blogs")
                      .update({
                        title: formData.title,
                        slug: generatedSlug,
                        category: formData.category,
                        content: formData.content,
                        cover_image: formData.cover_image,
                        status: formData.published ? "Published" : "Draft",
                      })
                      .eq("id", editingPost.id);
                  } else {
                    await supabase.from("blogs").insert({
                      title: formData.title,
                      slug: generatedSlug,
                      category: formData.category,
                      content: formData.content,
                      cover_image: formData.cover_image,
                      status: formData.published ? "Published" : "Draft",
                    });
                  }
                  setShowAddModal(false);
                  loadPosts();
                  alert(editingPost ? "Đã cập nhật bài viết!" : "Đã thêm bài viết mới!");
                } catch (err) {
                  console.error("Error saving blog:", err);
                  alert("Có lỗi xảy ra khi lưu bài viết!");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Khám phá Hồ Gươm - Trái tim của Hà Nội"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as "culture" | "travel" | "landmark" | "news",
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="culture">Văn hóa</option>
                    <option value="travel">Du lịch</option>
                    <option value="landmark">Địa danh</option>
                    <option value="news">Tin tức</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Đường dẫn (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Tự động tạo nếu để trống"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                  URL Ảnh đại diện
                </label>
                <input
                  type="text"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="/images/hanoi-banner.jpg"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                  Nội dung bài viết *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-neutral-300"
                />
                <label htmlFor="pub-check" className="text-sm text-neutral-700 font-medium">
                  Xuất bản ngay (Hiển thị công khai)
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800"
                >
                  {editingPost ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

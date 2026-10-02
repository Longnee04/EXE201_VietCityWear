"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Video,
  Loader2,
} from "lucide-react";

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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const categories = [
    { value: "all", label: "Tất cả bài viết" },
    { value: "culture", label: "Văn hóa" },
    { value: "travel", label: "Du lịch" },
    { value: "landmark", label: "Địa danh" },
    { value: "news", label: "Tin tức" },
  ];

  // Load posts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "Khám phá Hồ Gươm - Trái tim của Hà Nội",
          slug: "kham-pha-ho-guom-trai-tim-cua-ha-noi",
          excerpt: "Hồ Gươm không chỉ là biểu tượng của Hà Nội mà còn là nơi lưu giữ nhiều câu chuyện lịch sử văn hóa...",
          content: "Nội dung đầy đủ bài viết...",
          category: "landmark",
          author: "Admin VIET CITY WEAR",
          featuredImage: "/images/ho-guom.jpg",
          videoUrl: null,
          tags: ["Hà Nội", "Hồ Gươm", "Di tích lịch sử"],
          published: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Văn Miếu Quốc Tử Giám - Ngôi trường xưa nhất Việt Nam",
          slug: "van-mieu-quoc-tu-giam-ngoi-truong-xua-nhat-viet-nam",
          excerpt: "Văn Miếu là quần thể di tích lịch sử văn hóa độc đáo, gắn liền với truyền thống hiếu học...",
          content: "Nội dung đầy đủ bài viết...",
          category: "culture",
          author: "Admin VIET CITY WEAR",
          featuredImage: "/images/van-mieu.jpg",
          videoUrl: "https://youtube.com/watch?v=example",
          tags: ["Hà Nội", "Văn Miếu", "Giáo dục"],
          published: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "5 địa điểm du lịch không thể bỏ qua ở Hà Nội",
          slug: "5-dia-diem-du-lich-khong-the-bo-qua-o-ha-noi",
          excerpt: "Hà Nội với hơn 1000 năm văn hiến có vô số điểm đến hấp dẫn du khách...",
          content: "Nội dung đầy đủ bài viết...",
          category: "travel",
          author: "Admin VIET CITY WEAR",
          featuredImage: null,
          videoUrl: null,
          tags: ["Hà Nội", "Du lịch", "Gợi ý"],
          published: false,
          publishedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter posts
  useEffect(() => {
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

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      // TODO: API call to delete post
      setPosts(posts.filter((p) => p.id !== id));
      alert("Đã xóa bài viết thành công!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Có lỗi xảy ra khi xóa bài viết!");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      // TODO: API call to toggle publish status
      setPosts(
        posts.map((p) =>
          p.id === id
            ? {
                ...p,
                published: !p.published,
                publishedAt: !p.published ? new Date().toISOString() : null,
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

      {/* Add/Edit Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              Form thêm/sửa bài viết sẽ được triển khai ở đây với các trường: Tiêu đề, Slug, Danh
              mục, Nội dung (Editor), Ảnh đại diện, Video URL, Tags, Trạng thái xuất bản.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  loadPosts();
                }}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800"
              >
                {editingPost ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

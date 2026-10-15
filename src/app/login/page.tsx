"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
  LogOut,
  Edit2,
  Save,
  Package,
  ShoppingBag,
  Search,
  MapPin,
  RefreshCw,
  Sparkles,
  Gift,
  KeyRound,
  Plus,
  Trash2,
  Check,
  Calendar,
  CreditCard,
  Crown,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { formatPrice } from "@/data/products";

function formatAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  }
  if (message.includes("User already registered")) {
    return "Email này đã được đăng ký tài khoản. Vui lòng chuyển sang Đăng nhập.";
  }
  if (message.includes("Password should be at least")) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  if (message.includes("Email not confirmed")) {
    return "Tài khoản chưa được xác nhận qua Email. Vui lòng kiểm tra hộp thư.";
  }
  if (message.includes("Too many requests") || message.includes("rate limit")) {
    return "Bạn đã thử quá nhiều lần. Vui lòng chờ ít phút rồi thử lại.";
  }
  return message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

interface OrderItemDetail {
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface UserOrder {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  total_amount: number;
  payment_method: string;
  status: "processing" | "completed" | "canceled";
  created_at: string;
  note?: string | null;
  items?: OrderItemDetail[];
}

interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

type TabType = "orders" | "address" | "profile" | "membership" | "password";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params
  const queryTab = searchParams.get("tab");
  const queryPhone = searchParams.get("phone") || "";
  const queryName = searchParams.get("name") || "";

  // Auth Modes when logged out: "login" | "register"
  const [authMode, setAuthMode] = useState<"login" | "register">(
    queryTab === "register" ? "register" : "login"
  );

  // User state
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    phone: string;
    email: string;
    role: string;
    birthday?: string;
    gender?: string;
  } | null>(null);

  // 2-Column Dashboard Tab for authenticated user (matches Levents screenshot)
  const [activeTab, setActiveTab] = useState<TabType>(
    queryTab === "orders" ? "orders" : "profile"
  );

  // Orders list
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | "processing" | "completed" | "canceled">("all");

  // Address book state
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
  const [newAddrDetail, setNewAddrDetail] = useState("");
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [regFullName, setRegFullName] = useState(queryName);
  const [regPhone, setRegPhone] = useState(queryPhone);
  const [regEmail, setRegEmail] = useState("");
  const [regBirthday, setRegBirthday] = useState("");
  const [regGender, setRegGender] = useState("Nam");
  const [regPassword, setRegPassword] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Edit Profile inputs
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editGender, setEditGender] = useState("Nam");

  // Change Password inputs
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper: Fetch orders
  const loadOrdersForUser = async (userId: string, phone?: string): Promise<UserOrder[]> => {
    try {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (phone) {
        query = query.or(`user_id.eq.${userId},receiver_phone.eq.${phone}`);
      } else {
        query = query.eq("user_id", userId);
      }

      const { data: ordersData, error: ordersErr } = await query;
      if (ordersErr || !ordersData || ordersData.length === 0) {
        return [];
      }

      const orderIds = ordersData.map((o) => o.id);
      const [{ data: itemsData }, { data: prodsData }] = await Promise.all([
        supabase.from("order_items").select("*").in("order_id", orderIds),
        supabase.from("products").select("id, name"),
      ]);

      return ordersData.map((ord) => {
        const matched = (itemsData || []).filter((it) => it.order_id === ord.id);
        const items: OrderItemDetail[] =
          matched.length > 0
            ? matched.map((it) => {
                const p = (prodsData || []).find((pr) => pr.id === it.product_id);
                return {
                  product_name: p?.name || "Áo Thun Văn Hóa VietCityWear",
                  size: it.size || "L",
                  color: it.color || "Tiêu chuẩn",
                  quantity: Number(it.quantity) || 1,
                  price: Number(it.unit_price) || Number(ord.total_amount),
                };
              })
            : [
                {
                  product_name: "Bộ Áo Thun Di Sản & Quà Tặng (COD)",
                  size: "L",
                  color: "Tiêu chuẩn",
                  quantity: 1,
                  price: Number(ord.total_amount),
                },
              ];

        return {
          ...ord,
          items,
        };
      });
    } catch (e) {
      console.warn("Lỗi tải danh sách đơn hàng:", e);
      return [];
    }
  };

  // Check auth session on mount
  useEffect(() => {
    async function loadUserSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          const { data: profile } = await supabase
            .from("users")
            .select("full_name, phone, email, role")
            .eq("id", session.user.id)
            .maybeSingle();

          const resolvedProfile = {
            full_name: profile?.full_name || session.user.user_metadata?.full_name || "Khách hàng",
            phone: profile?.phone || session.user.user_metadata?.phone || "",
            email: session.user.email || "",
            role: profile?.role || session.user.user_metadata?.role || "user",
            birthday: session.user.user_metadata?.birthday || "2000-01-01",
            gender: session.user.user_metadata?.gender || "Nam",
          };

          setUserProfile(resolvedProfile);
          setEditFullName(resolvedProfile.full_name);
          setEditPhone(resolvedProfile.phone);
          setEditBirthday(resolvedProfile.birthday);
          setEditGender(resolvedProfile.gender);

          // Initialize saved addresses
          const savedAddrKey = `vcw_addr_${session.user.id}`;
          const localAddrs = localStorage.getItem(savedAddrKey);
          if (localAddrs) {
            try {
              setAddresses(JSON.parse(localAddrs));
            } catch {}
          } else if (resolvedProfile.full_name && resolvedProfile.phone) {
            const initialAddrs: SavedAddress[] = [
              {
                id: "addr-1",
                fullName: resolvedProfile.full_name,
                phone: resolvedProfile.phone,
                address: "Hà Nội, Việt Nam",
                isDefault: true,
              },
            ];
            setAddresses(initialAddrs);
            localStorage.setItem(savedAddrKey, JSON.stringify(initialAddrs));
          }

          // Fetch user orders
          setIsLoadingOrders(true);
          const orders = await loadOrdersForUser(session.user.id, resolvedProfile.phone);
          setUserOrders(orders);
          setIsLoadingOrders(false);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra phiên:", err);
      }
    }
    loadUserSession();
  }, []);

  // Filtered orders by status & search query
  const filteredOrders = useMemo(() => {
    let list = userOrders;
    if (orderStatusFilter !== "all") {
      list = list.filter((o) => o.status === orderStatusFilter);
    }
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      list = list.filter(
        (ord) =>
          ord.id.toLowerCase().includes(q) ||
          ord.receiver_name.toLowerCase().includes(q) ||
          ord.shipping_address.toLowerCase().includes(q) ||
          (ord.items && ord.items.some((it) => it.product_name.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [userOrders, orderStatusFilter, orderSearchQuery]);

  // Handle Login (Supports Email or Phone Number)
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const inputVal = email.trim();
    if (!inputVal || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ Số điện thoại/Email và Mật khẩu.");
      return;
    }

    try {
      setIsLoading(true);
      let targetEmail = inputVal;

      // If user inputs a phone number (does not contain @), look up email
      if (!inputVal.includes("@")) {
        const { data: userByPhone, error: phoneErr } = await supabase
          .from("users")
          .select("email")
          .eq("phone", inputVal)
          .maybeSingle();

        if (phoneErr || !userByPhone?.email) {
          setErrorMessage("Không tìm thấy tài khoản gắn với số điện thoại này. Bạn có thể đăng nhập bằng email hoặc bấm Đăng ký.");
          setIsLoading(false);
          return;
        }
        targetEmail = userByPhone.email;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password,
      });

      if (authError) {
        setErrorMessage(formatAuthError(authError.message));
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        setErrorMessage("Không tìm thấy thông tin tài khoản.");
        setIsLoading(false);
        return;
      }

      const userId = authData.user.id;
      const { data: profile } = await supabase
        .from("users")
        .select("role, full_name, phone")
        .eq("id", userId)
        .maybeSingle();

      const assignedRole = profile?.role || authData.user.user_metadata?.role || "user";

      if (assignedRole === "admin") {
        setSuccessMessage("Đăng nhập Admin thành công! Đang chuyển hướng...");
        router.refresh();
        setTimeout(() => router.push("/admin/dashboard"), 600);
      } else {
        setSuccessMessage("Đăng nhập thành công!");
        setCurrentUser(authData.user);
        const resolvedProfile = {
          full_name: profile?.full_name || authData.user.user_metadata?.full_name || "Khách hàng",
          phone: profile?.phone || authData.user.user_metadata?.phone || "",
          email: authData.user.email || "",
          role: assignedRole,
          birthday: authData.user.user_metadata?.birthday || "2000-01-01",
          gender: authData.user.user_metadata?.gender || "Nam",
        };
        setUserProfile(resolvedProfile);
        setEditFullName(resolvedProfile.full_name);
        setEditPhone(resolvedProfile.phone);
        setEditBirthday(resolvedProfile.birthday);
        setEditGender(resolvedProfile.gender);

        setIsLoadingOrders(true);
        const orders = await loadOrdersForUser(userId, resolvedProfile.phone);
        setUserOrders(orders);
        setIsLoadingOrders(false);
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
      setIsLoading(false);
    }
  };

  // Handle Register (Matching Levents fields)
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regEmail.trim() || !regPassword) {
      setErrorMessage("Vui lòng nhập Email và Mật khẩu.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            full_name: regFullName.trim() || "Khách hàng",
            phone: regPhone.trim(),
            birthday: regBirthday.trim() || "2000-01-01",
            gender: regGender,
            role: "user",
          },
        },
      });

      if (authError) {
        setErrorMessage(formatAuthError(authError.message));
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        try {
          await supabase.from("users").upsert({
            id: authData.user.id,
            email: regEmail.trim(),
            full_name: regFullName.trim() || "Khách hàng",
            phone: regPhone.trim(),
            role: "user",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        } catch (dbErr) {
          console.warn("Không thể ghi vào public.users, tiếp tục phiên:", dbErr);
        }

        setSuccessMessage("Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay để theo dõi đơn hàng.");
        setIsLoading(false);
        setEmail(regPhone || regEmail);
        setPassword(regPassword);
        setAuthMode("login");
      }
    } catch {
      setErrorMessage("Không thể tạo tài khoản. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  // Handle Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);

      await supabase
        .from("users")
        .update({
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .eq("id", currentUser.id);

      await supabase.auth.updateUser({
        data: {
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
          birthday: editBirthday,
          gender: editGender,
        },
      });

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editFullName.trim(),
              phone: editPhone.trim(),
              birthday: editBirthday,
              gender: editGender,
            }
          : null
      );
      setSuccessMessage("Cập nhật thông tin tài khoản thành công!");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setErrorMessage("Không thể lưu thông tin. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  // Handle Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newAddrName.trim() || !newAddrPhone.trim() || !newAddrDetail.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      fullName: newAddrName.trim(),
      phone: newAddrPhone.trim(),
      address: newAddrDetail.trim(),
      isDefault: newAddrIsDefault || addresses.length === 0,
    };

    let updated = addresses;
    if (newAddr.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }
    updated = [newAddr, ...updated];

    setAddresses(updated);
    localStorage.setItem(`vcw_addr_${currentUser.id}`, JSON.stringify(updated));

    setNewAddrName("");
    setNewAddrPhone("");
    setNewAddrDetail("");
    setNewAddrIsDefault(false);
    setIsAddingAddress(false);
    setSuccessMessage("Đã thêm địa chỉ nhận hàng mới thành công!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem(`vcw_addr_${currentUser.id}`, JSON.stringify(updated));
  };

  // Handle Delete Address
  const handleDeleteAddress = (id: string) => {
    if (!currentUser) return;
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    localStorage.setItem(`vcw_addr_${currentUser.id}`, JSON.stringify(updated));
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setErrorMessage("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw error;

      setSuccessMessage("Đổi mật khẩu thành công!");
      setNewPass("");
      setConfirmPass("");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể cập nhật mật khẩu.");
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      setUserOrders([]);
      setSuccessMessage("Đã đăng xuất thành công.");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const renderStatusBadge = (status: "processing" | "completed" | "canceled") => {
    if (status === "completed") {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm">
          Đã nhận hàng / Hoàn tất
        </span>
      );
    }
    if (status === "canceled") {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200 rounded-sm">
          Đã hủy đơn
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 rounded-sm">
        Đang xử lý / Chuẩn bị giao
      </span>
    );
  };

  const totalSpent = userOrders.reduce(
    (sum, o) => sum + (o.status === "completed" ? Number(o.total_amount) : 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between text-[#111111] antialiased selection:bg-black selection:text-white">
      {/* Top Header */}
      <header className="w-full border-b border-[#EAEAEA] bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#555] hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-[#EAEAEA] bg-[#F7F4EE] flex-shrink-0">
              <Image
                src="/images/logo-vietcitywear.png"
                alt="Logo VIET CITY WEAR"
                fill
                className="object-cover"
                sizes="32px"
                priority
              />
            </div>
            <span className="font-extrabold tracking-[0.18em] uppercase text-sm">
              VIET CITY WEAR
            </span>
          </Link>

          <Link
            href="/products"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] hover:text-black transition-colors"
          >
            Cửa hàng
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ============================================================== */}
        {/* VIEW A: IF USER IS LOGGED IN -> 2-COLUMN E-COMMERCE DASHBOARD  */}
        {/* ============================================================== */}
        {currentUser && userProfile ? (
          <div>
            {/* Breadcrumb matching Levents (Home / Profile Page) */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-8 font-medium">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-black font-semibold">Profile Page</span>
            </div>

            {/* Notification alert if any */}
            {successMessage && (
              <div className="mb-6 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 2-Column Grid */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {/* LEFT COLUMN: Sidebar Navigation matching Levents */}
              <div className="w-full md:w-64 lg:w-72 bg-white p-6 border border-[#eaeaea] rounded-sm shrink-0">
                {/* User Greeting & Avatar */}
                <div className="flex items-center gap-3.5 pb-6 border-b border-[#eaeaea]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-200 bg-[#F7F4EE] flex-shrink-0">
                    <Image
                      src="/images/logo-vietcitywear.png"
                      alt="Viet City Wear"
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-stone-500">Xin chào bạn !</p>
                    <h2 className="text-sm font-bold text-black truncate uppercase tracking-tight">
                      {userProfile.full_name || "Thành viên"}
                    </h2>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <span>Cấp độ:</span>
                      <strong className="text-black font-semibold">
                        {totalSpent > 1000000 ? "Hội viên Bạc" : "Thành viên"}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Sidebar Navigation Links matching Levents screenshot */}
                <nav className="mt-5 space-y-1 text-xs">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                      activeTab === "orders"
                        ? "bg-black text-white"
                        : "text-stone-700 hover:bg-stone-50 hover:text-black"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4" />
                      <span>Đơn hàng của tôi</span>
                    </div>
                    {userOrders.length > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          activeTab === "orders" ? "bg-white text-black" : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {userOrders.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("address")}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                      activeTab === "address"
                        ? "bg-black text-white"
                        : "text-stone-700 hover:bg-stone-50 hover:text-black"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Sổ địa chỉ</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                      activeTab === "profile"
                        ? "bg-black text-white"
                        : "text-stone-700 hover:bg-stone-50 hover:text-black"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Thông tin của tôi</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("membership")}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                      activeTab === "membership"
                        ? "bg-black text-white"
                        : "text-stone-700 hover:bg-stone-50 hover:text-black"
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>Membership & Quà tặng</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("password")}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                      activeTab === "password"
                        ? "bg-black text-white"
                        : "text-stone-700 hover:bg-stone-50 hover:text-black"
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Thay đổi mật khẩu</span>
                  </button>

                  {userProfile.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xs font-semibold uppercase tracking-wider text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Trang Quản Trị Admin</span>
                    </Link>
                  )}

                  <div className="pt-4 mt-2 border-t border-[#eaeaea]">
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-red-600 hover:bg-red-50 rounded-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </nav>
              </div>

              {/* RIGHT COLUMN: Content Panel matching Levents tabs */}
              <div className="flex-1 w-full bg-white p-6 sm:p-8 border border-[#eaeaea] rounded-sm min-h-[500px]">
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: ĐƠN HÀNG CỦA TÔI                                      */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "orders" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#eaeaea] mb-6">
                      <div>
                        <h2 className="text-base font-bold uppercase tracking-tight text-black">
                          ĐƠN HÀNG CỦA TÔI
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Quản lý và tra cứu tiến độ vận chuyển đơn hàng COD của bạn
                        </p>
                      </div>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Mua sắm thêm</span>
                      </Link>
                    </div>

                    {/* Status Horizontal Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-[#eaeaea] pb-4 mb-5">
                      {[
                        { key: "all", label: "Tất cả" },
                        { key: "processing", label: "Đang xử lý / Chuẩn bị" },
                        { key: "completed", label: "Đã giao thành công" },
                        { key: "canceled", label: "Đã hủy" },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setOrderStatusFilter(tab.key as any)}
                          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                            orderStatusFilter === tab.key
                              ? "bg-black text-white"
                              : "bg-stone-100 text-stone-600 hover:text-black"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Search inside orders */}
                    {userOrders.length > 0 && (
                      <div className="relative mb-6">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-200 rounded-sm focus:outline-none focus:border-black bg-stone-50/50"
                        />
                      </div>
                    )}

                    {/* Orders listing */}
                    {isLoadingOrders ? (
                      <div className="py-16 text-center text-stone-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
                        <p className="text-xs font-semibold uppercase tracking-wider">
                          Đang tải danh sách đơn hàng...
                        </p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="py-16 text-center">
                        <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-black mb-1">
                          Không tìm thấy đơn hàng nào
                        </h3>
                        <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto">
                          Bạn chưa có đơn hàng nào trong mục này. Khám phá các mẫu áo thun di sản Hà Nội, Huế, Hội An ngay hôm nay!
                        </p>
                        <Link
                          href="/products"
                          className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors inline-block"
                        >
                          Khám phá Cửa hàng
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-5 border border-[#eaeaea] rounded-sm bg-[#FAFAFA] hover:border-black transition-colors"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#eaeaea]">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                  Mã đơn hàng
                                </span>
                                <span className="text-xs font-mono font-bold text-black">
                                  #{ord.id.slice(0, 10).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-right">
                                {renderStatusBadge(ord.status)}
                                <span className="text-[10px] text-stone-400 block mt-1">
                                  {new Date(ord.created_at).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Items list */}
                            <div className="py-3.5 space-y-2.5 border-b border-[#eaeaea]">
                              {ord.items &&
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between items-start text-xs">
                                    <div>
                                      <p className="font-bold text-stone-900">{it.product_name}</p>
                                      <p className="text-[11px] text-stone-500 mt-0.5">
                                        Màu sắc: {it.color} • Kích cỡ: {it.size} • Số lượng: {it.quantity}
                                      </p>
                                    </div>
                                    <span className="font-semibold text-stone-900">
                                      {formatPrice(it.price * it.quantity)}
                                    </span>
                                  </div>
                                ))}
                            </div>

                            {/* Bottom row */}
                            <div className="pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="text-stone-600 max-w-sm">
                                <p className="truncate text-[11px]">
                                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-stone-400" />
                                  {ord.shipping_address}
                                </p>
                                <p className="text-[11px] text-stone-500 mt-0.5">
                                  Người nhận: {ord.receiver_name} ({ord.receiver_phone})
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                  {ord.payment_method === "SEPAY" ? "Chuyển khoản SePay QR" : "Thanh toán khi nhận (COD)"}
                                </span>
                                <span className="text-sm font-extrabold text-black">
                                  {formatPrice(ord.total_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: SỔ ĐỊA CHỈ                                            */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "address" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#eaeaea] mb-6">
                      <div>
                        <h2 className="text-base font-bold uppercase tracking-tight text-black">
                          SỔ ĐỊA CHỈ NHẬN HÀNG
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Quản lý danh sách địa chỉ giao hàng của bạn
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm địa chỉ mới</span>
                      </button>
                    </div>

                    {/* Add Address Form */}
                    {isAddingAddress && (
                      <form onSubmit={handleAddAddress} className="mb-6 p-5 border border-stone-300 bg-[#FAFAFA] rounded-sm space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                          Thông tin địa chỉ mới
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                              Họ và tên người nhận *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddrName}
                              onChange={(e) => setNewAddrName(e.target.value)}
                              placeholder="Ví dụ: Nguyễn Long"
                              className="w-full px-3 py-2 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                              Số điện thoại *
                            </label>
                            <input
                              type="tel"
                              required
                              value={newAddrPhone}
                              onChange={(e) => setNewAddrPhone(e.target.value)}
                              placeholder="0912 345 678"
                              className="w-full px-3 py-2 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                            Địa chỉ chi tiết (Số nhà, đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành) *
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={newAddrDetail}
                            onChange={(e) => setNewAddrDetail(e.target.value)}
                            placeholder="Ví dụ: Số 18 Hàng Bông, Phường Hàng Gai, Quận Hoàn Kiếm, Hà Nội"
                            className="w-full px-3 py-2 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="setDefaultCheck"
                            checked={newAddrIsDefault}
                            onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                          <label htmlFor="setDefaultCheck" className="text-xs text-stone-700 cursor-pointer">
                            Đặt làm địa chỉ nhận hàng mặc định
                          </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                          >
                            Lưu địa chỉ
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingAddress(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-bold uppercase hover:bg-white transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Address cards */}
                    {addresses.length === 0 ? (
                      <div className="py-12 text-center text-stone-500 text-xs">
                        Bạn chưa lưu địa chỉ nhận hàng nào. Bấm <strong>Thêm địa chỉ mới</strong> để lưu thông tin giao hàng thuận tiện hơn.
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-4 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              addr.isDefault ? "border-black bg-stone-50/50" : "border-[#eaeaea] bg-white"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-xs text-black">{addr.fullName}</span>
                                <span className="text-stone-400">•</span>
                                <span className="text-xs text-stone-600">{addr.phone}</span>
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-xs">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">{addr.address}</p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {!addr.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[11px] font-bold text-stone-600 hover:text-black underline mr-2"
                                >
                                  Thiết lập mặc định
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                                title="Xóa địa chỉ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: THÔNG TIN CỦA TÔI (PROFILE)                           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "profile" && (
                  <div>
                    <div className="pb-5 border-b border-[#eaeaea] mb-6">
                      <h2 className="text-base font-bold uppercase tracking-tight text-black">
                        THÔNG TIN CỦA TÔI
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                      </p>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          required
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                          Số điện thoại nhận hàng *
                        </label>
                        <input
                          type="tel"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                          Địa chỉ Email liên kết
                        </label>
                        <input
                          type="email"
                          disabled
                          value={userProfile.email}
                          className="w-full px-3.5 py-2.5 text-xs border border-stone-200 bg-stone-100 text-stone-500 rounded-xs cursor-not-allowed"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">Email dùng để đăng nhập và bảo mật</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                            Ngày sinh
                          </label>
                          <input
                            type="date"
                            value={editBirthday}
                            onChange={(e) => setEditBirthday(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black rounded-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                            Giới tính
                          </label>
                          <select
                            value={editGender}
                            onChange={(e) => setEditGender(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black rounded-xs cursor-pointer"
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 mt-4"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Lưu thay đổi</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: MEMBERSHIP & QUÀ TẶNG (MATCHING LEVENTS SCREENSHOT)   */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "membership" && (
                  <div>
                    <div className="pb-5 border-b border-[#eaeaea] mb-6">
                      <h2 className="text-base font-bold uppercase tracking-tight text-black">
                        HỘI VIÊN & QUÀ TẶNG VOUCHER
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Theo dõi cấp độ thành viên, điểm tích lũy và voucher quà tặng
                      </p>
                    </div>

                    {/* Stats Grid matching Levents */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#FAFAFA] border border-[#eaeaea] rounded-sm mb-8">
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-semibold block">Cấp độ:</span>
                        <strong className="text-sm font-bold text-black mt-1 block">
                          {totalSpent > 1000000 ? "Hội viên Bạc" : "Thành viên"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-semibold block">Tổng đơn mua:</span>
                        <strong className="text-sm font-bold text-black mt-1 block">
                          {userOrders.length} đơn
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-semibold block">Tổng tiền chi:</span>
                        <strong className="text-sm font-bold text-black mt-1 block">
                          {formatPrice(totalSpent)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-semibold block">Điểm thưởng:</span>
                        <strong className="text-sm font-bold text-black mt-1 block">
                          {Math.floor(totalSpent / 10000)} điểm
                        </strong>
                      </div>
                    </div>

                    {/* Vouchers list matching Levents */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-4 flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        <span>Voucher ưu đãi của bạn</span>
                      </h3>

                      <div className="space-y-3.5">
                        {/* Voucher 1 */}
                        <div className="p-4 border border-stone-200 rounded-sm flex items-center justify-between gap-4 bg-white hover:border-black transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-stone-100 flex items-center justify-center font-bold text-xs uppercase tracking-wider text-stone-700">
                              VCW
                            </div>
                            <div>
                              <p className="font-bold text-xs text-black">VCWFREESHIP</p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000₫
                              </p>
                            </div>
                          </div>
                          <Link
                            href="/products"
                            className="px-4 py-1.5 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                          >
                            Sử dụng
                          </Link>
                        </div>

                        {/* Voucher 2 */}
                        <div className="p-4 border border-stone-200 rounded-sm flex items-center justify-between gap-4 bg-white hover:border-black transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-stone-100 flex items-center justify-center font-bold text-xs uppercase tracking-wider text-stone-700">
                              NFC
                            </div>
                            <div>
                              <p className="font-bold text-xs text-black">VCWNFC2026</p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                Tặng kèm 01 Móc khóa chip NFC + 05 Thẻ bưu thiếp văn hóa cho mọi đơn áo
                              </p>
                            </div>
                          </div>
                          <Link
                            href="/products"
                            className="px-4 py-1.5 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                          >
                            Sử dụng
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 5: THAY ĐỔI MẬT KHẨU                                     */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "password" && (
                  <div>
                    <div className="pb-5 border-b border-[#eaeaea] mb-6">
                      <h2 className="text-base font-bold uppercase tracking-tight text-black">
                        THAY ĐỔI MẬT KHẨU
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Cập nhật mật khẩu để đảm bảo an toàn cho tài khoản của bạn
                      </p>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                          Mật khẩu mới (tối thiểu 6 ký tự) *
                        </label>
                        <input
                          type="password"
                          required
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                          Xác nhận mật khẩu mới *
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:border-black rounded-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 mt-4"
                      >
                        {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu mới"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW B: EXACT LEVENTS.ASIA STYLE — NO CARD, NO SHADOW, CLEAN   */
          /* ============================================================== */
          <div className="max-w-[680px] mx-auto px-6 sm:px-10 pt-4 pb-16">
            {/* Breadcrumb — exactly like levents.asia */}
            <div className="flex items-center gap-2 text-[13px] text-stone-500 mb-10">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-black">
                {authMode === "register" ? "Register Page" : "Login Page"}
              </span>
            </div>

            {/* Centered title — exactly like levents.asia */}
            <h1 className="text-center text-[22px] sm:text-[26px] font-normal text-black mb-10 tracking-normal">
              {authMode === "login" ? "Đăng nhập" : "Đăng ký"}
            </h1>

            {/* Feedback messages */}
            {errorMessage && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ===== LOGIN FORM (matches levents.asia/login screenshot) ===== */}
            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                      className="w-full px-4 pr-10 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* "Quên thông tin tài khoản" — left-aligned, plain text like Levents */}
                <div>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[13px] text-black hover:underline transition-colors"
                  >
                    Quên thông tin tài khoản
                  </button>
                </div>

                {/* Full-width black button — exactly like Levents */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white text-[14px] font-normal tracking-wide hover:bg-stone-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                {/* "Bạn chưa có tài khoản? Đăng ký ngay" — centered, like Levents */}
                <div className="text-center text-[13px] text-stone-500 pt-2">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-black font-semibold hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </div>

                {/* Demo accounts — subtle section below */}
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 mb-2 text-center">
                    Tài khoản mẫu (Bấm để điền nhanh)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill("admin@vietcitywear.com", "password123")}
                      className="p-2.5 border border-stone-200 hover:border-black text-left text-[12px] transition-colors"
                    >
                      <div className="font-semibold text-black">Admin</div>
                      <div className="text-[11px] text-stone-400 truncate">admin@vietcitywear.com</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill("khachhang@gmail.com", "password123")}
                      className="p-2.5 border border-stone-200 hover:border-black text-left text-[12px] transition-colors"
                    >
                      <div className="font-semibold text-black">Khách hàng</div>
                      <div className="text-[11px] text-stone-400 truncate">khachhang@gmail.com</div>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* ===== REGISTER FORM (matches levents.asia/register screenshot) ===== */
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Nhập họ tên tại đây"
                    className="w-full px-4 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Nhập số điện thoại tại đây"
                    className="w-full px-4 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Thông tin này cần bắt buộc"
                    className="w-full px-4 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    required
                    value={regBirthday}
                    onChange={(e) => setRegBirthday(e.target.value)}
                    className="w-full px-4 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full px-4 py-3 text-[13px] text-black border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-black mb-2">
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mật khẩu tối thiểu 6 ký tự"
                      className="w-full px-4 pr-10 py-3 text-[13px] text-black placeholder:text-stone-400 border border-stone-300 bg-white focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Full-width black button — exactly like Levents */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white text-[14px] font-normal tracking-wide hover:bg-stone-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </button>

                {/* "Bạn đã có tài khoản? Đăng nhập tại đây" — centered, like Levents */}
                <div className="text-center text-[13px] text-stone-500 pt-2">
                  Bạn đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-black font-semibold hover:underline"
                  >
                    Đăng nhập tại đây
                  </button>
                </div>
              </form>
            )}

            {/* Forgot password modal */}
            {forgotModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white max-w-sm w-full p-6 shadow-xl">
                  <h3 className="text-[14px] font-semibold text-black mb-2">
                    Quên thông tin tài khoản
                  </h3>
                  <p className="text-[13px] text-stone-600 leading-relaxed mb-4">
                    Để bảo mật tài khoản, quý khách vui lòng liên hệ hotline Viet City Wear hoặc chat trực tiếp qua biểu tượng CSKH ở góc phải màn hình để được hỗ trợ cấp lại mật khẩu nhanh nhất.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="px-5 py-2.5 bg-black text-white text-[13px] hover:bg-stone-800 transition-colors"
                    >
                      Đã hiểu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-stone-400 border-t border-[#EAEAEA] bg-white">
        © {new Date().getFullYear()} VIET CITY WEAR. All rights reserved.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

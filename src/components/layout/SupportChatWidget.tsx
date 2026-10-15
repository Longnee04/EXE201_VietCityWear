"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  Package,
  Sparkles,
  UserCheck,
  PhoneCall,
  Move,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function SupportChatWidget() {
  const pathname = usePathname();

  // ONLY show on user shopping/e-commerce related pages, NEVER on admin or system pages
  const isSalesUserPage = useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return false;
    return (
      pathname === "/" ||
      pathname.startsWith("/products") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/explore")
    );
  }, [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "chat">("menu");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Chào bạn! Viet City Wear rất vui được hỗ trợ bạn. Bạn cần tư vấn về kích cỡ áo, đơn hàng COD hay quà tặng chip NFC ạ?",
      time: "Vừa xong",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Draggable button position state
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const pointerDownRef = useRef<{
    startX: number;
    startY: number;
    buttonX: number;
    buttonY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    buttonX: 0,
    buttonY: 0,
    hasMoved: false,
  });

  // Keep button within window bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => {
        if (!prev) return null;
        const maxX = window.innerWidth - 56 - 16;
        const maxY = window.innerHeight - 56 - 16;
        return {
          x: Math.min(Math.max(16, prev.x), Math.max(16, maxX)),
          y: Math.min(Math.max(16, prev.y), Math.max(16, maxY)),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (mode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Only main button
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    pointerDownRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      buttonX: rect.left,
      buttonY: rect.top,
      hasMoved: false,
    };

    setIsDragging(true);
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - pointerDownRef.current.startX;
    const dy = e.clientY - pointerDownRef.current.startY;

    if (Math.hypot(dx, dy) > 5) {
      pointerDownRef.current.hasMoved = true;
    }

    const btnSize = 56;
    const minX = 16;
    const maxX = Math.max(minX, window.innerWidth - btnSize - 16);
    const minY = 16;
    const maxY = Math.max(minY, window.innerHeight - btnSize - 16);

    const nextX = Math.min(Math.max(minX, pointerDownRef.current.buttonX + dx), maxX);
    const nextY = Math.min(Math.max(minY, pointerDownRef.current.buttonY + dy), maxY);

    setPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Only toggle chat if user clicked without moving
    if (!pointerDownRef.current.hasMoved) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelectQuickPrompt = (promptText: string, botReply: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: promptText,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    const replyMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: botReply,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setMode("chat");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulate smart support reply
    setTimeout(() => {
      let reply = "Cảm ơn bạn đã nhắn tin. Tư vấn viên của Viet City Wear đang kiểm tra thông tin và sẽ phản hồi bạn trong giây lát ạ!";
      const lower = userText.toLowerCase();
      if (lower.includes("size") || lower.includes("cỡ")) {
        reply = "Form áo Viet City Wear là dáng Oversized thoải mái (Cotton 100% 250GSM). M (50-65kg), L (65-75kg), XL (75-85kg). Bạn cho mình xin chiều cao và cân nặng để tư vấn chuẩn nhất nhé!";
      } else if (lower.includes("đơn") || lower.includes("ship") || lower.includes("cod") || lower.includes("sepay")) {
        reply = "Đơn hàng hỗ trợ cả 2 hình thức: Thanh toán khi nhận hàng (Ship COD) và Chuyển khoản ngân hàng tự động qua mã SePay QR. Bạn có thể đăng nhập tài khoản để tra cứu chi tiết hành trình vận chuyển bất kỳ lúc nào ạ.";
      } else if (lower.includes("nfc") || lower.includes("quà")) {
        reply = "Mỗi chiếc áo đều đi kèm hộp quà Branded Box, 05 bưu thiếp địa danh và 01 móc khóa chip NFC chạm điện thoại mở trang di sản văn hóa số.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: reply,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  // If page is not in user sales category, don't render anything
  if (!isSalesUserPage) {
    return null;
  }

  // Dynamic popup positioning based on movable button position
  const popupStyle: React.CSSProperties = pos
    ? {
        position: "fixed",
        zIndex: 50,
        ...(pos.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500)
          ? { right: `${Math.max(16, (typeof window !== "undefined" ? window.innerWidth : 1000) - (pos.x + 56))}px` }
          : { left: `${Math.max(16, pos.x)}px` }),
        ...(pos.y > (typeof window !== "undefined" ? window.innerHeight / 2 : 400)
          ? { bottom: `${Math.max(16, (typeof window !== "undefined" ? window.innerHeight : 800) - pos.y + 12)}px` }
          : { top: `${Math.max(16, pos.y + 68)}px` }),
      }
    : {
        position: "fixed",
        bottom: "96px",
        right: "24px",
        zIndex: 50,
      };

  const buttonStyle: React.CSSProperties = pos
    ? {
        position: "fixed",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 50,
        touchAction: "none",
      }
    : {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        touchAction: "none",
      };

  return (
    <>
      {/* Draggable Floating Action Trigger Button */}
      <div style={buttonStyle}>
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Nhắn tin hỗ trợ Viet City Wear (Có thể kéo di chuyển)"
          title="Kéo để di chuyển • Bấm để trò chuyện"
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-black shadow-[0_10px_35px_rgba(0,0,0,0.22)] select-none transition-transform duration-100 ${
            isDragging ? "cursor-grabbing scale-105 shadow-2xl" : "cursor-grab hover:scale-105 active:scale-95"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-black pointer-events-none" />
          ) : (
            <div className="relative w-9 h-9 pointer-events-none">
              <Image
                src="/images/logo-vietcitywear.png"
                alt="Viet City Wear Support"
                fill
                className="object-contain"
                sizes="36px"
              />
            </div>
          )}

          {/* Pulse notification badge */}
          {!isOpen && (
            <span className="absolute top-1 right-1 flex h-3 w-3 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Popup */}
      {isOpen && (
        <div
          style={popupStyle}
          className="w-[calc(100vw-32px)] sm:w-[380px] max-h-[580px] flex flex-col bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header styled like Levents */}
          <div className="bg-[#1E293B] text-white p-5 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-white p-1 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/logo-vietcitywear.png"
                    alt="Viet City Wear"
                    fill
                    className="object-contain p-0.5"
                    sizes="32px"
                  />
                </div>
                {mode === "chat" && (
                  <button
                    onClick={() => setMode("menu")}
                    className="p-1 -ml-1 text-stone-300 hover:text-white transition-colors"
                    title="Quay lại danh mục"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Đóng chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold mt-3 tracking-tight">Viet City Wear xin chàooo</h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Hãy gửi ngay cho tụi mình thông tin mà bạn cần hỗ trợ nha!
            </p>
          </div>

          {/* VIEW 1: Quick Actions & Topics (Matching Levents reference) */}
          {mode === "menu" ? (
            <div className="p-4 space-y-2.5 max-h-[400px] overflow-y-auto">
              {/* Option 1: Tư vấn chọn size áo */}
              <button
                onClick={() =>
                  handleSelectQuickPrompt(
                    "Tư vấn chọn size áo thun di sản 👕",
                    "Áo thun Viet City Wear là form Oversized chuẩn streetwear: Size M (50-65kg), Size L (65-75kg), Size XL (75-85kg), Size XXL (>85kg). Bạn đang thích mẫu thành phố nào và cần tư vấn cụ thể cân nặng bao nhiêu ạ?"
                  )
                }
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-stone-800">Tư vấn chọn size áo thun 👕</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 2: Thông tin ưu đãi */}
              <button
                onClick={() =>
                  handleSelectQuickPrompt(
                    "Mình muốn biết về thông tin ưu đãi 🏷️",
                    "Hiện tại Viet City Wear đang áp dụng: Freeship toàn quốc cho đơn từ 500.000₫. Mỗi áo đều đi kèm 01 móc khóa gắn chip NFC + 05 bưu thiếp văn hóa + Hộp quà đóng gói cao cấp."
                  )
                }
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-stone-800">Mình muốn biết về thông tin ưu đãi 🏷️</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 3: Kiểm tra tình trạng đơn hàng */}
              <button
                onClick={() =>
                  handleSelectQuickPrompt(
                    "Mình muốn kiểm tra tình trạng đơn hàng 🛒",
                    "Bạn có thể vào mục Tài Khoản > 'Đơn hàng của tôi' để tra cứu chi tiết tiến độ giao hàng COD. Hoặc gửi cho mình số điện thoại đặt hàng để tụi mình hỗ trợ kiểm tra ngay nhé!"
                  )
                }
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-stone-800">Mình muốn kiểm tra tình trạng đơn hàng 🛒</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 4: Hạng thành viên & Quà tặng NFC */}
              <button
                onClick={() =>
                  handleSelectQuickPrompt(
                    "Hạng thành viên & Trải nghiệm NFC 👑",
                    "Khi mua sắm và tạo tài khoản tại Viet City Wear, bạn sẽ được tích điểm thành viên nhận chiết khấu và quét chip NFC trên móc khóa để mở trang di sản thành phố tương ứng."
                  )
                }
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-stone-800">Hạng thành viên & Trải nghiệm NFC 👑</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 5: Gặp nhân viên tư vấn */}
              <button
                onClick={() =>
                  handleSelectQuickPrompt(
                    "Mình cần gặp Nhân viên tư vấn trực tiếp 😊",
                    "Dạ vâng! Bạn hãy nhắn nội dung cần hỗ trợ bên dưới hoặc gọi hotline 0912 345 678, tư vấn viên Viet City Wear sẽ hỗ trợ bạn ngay lập tức ạ."
                  )
                }
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-stone-800">Mình cần gặp Nhân viên tư vấn 😊</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Direct button to open chat thread */}
              <button
                onClick={() => setMode("chat")}
                className="w-full mt-3 py-3 bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tiếp tục trò chuyện trực tiếp</span>
              </button>
            </div>
          ) : (
            /* VIEW 2: Chat Conversation Thread */
            <div className="flex flex-col flex-1 h-[360px]">
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 text-xs rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-black text-white rounded-br-xs"
                          : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs shadow-2xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập nội dung cần hỗ trợ..."
                  className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-3.5 py-2 bg-black text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-40"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Footer watermark */}
          <div className="py-2 text-center text-[10px] text-stone-400 bg-stone-50 border-t border-stone-100">
            Viet City Wear Customer Support • Luôn sẵn sàng hỗ trợ bạn
          </div>
        </div>
      )}
    </>
  );
}

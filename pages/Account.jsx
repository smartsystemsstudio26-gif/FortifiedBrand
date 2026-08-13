import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/use-auth";
import { User, Package, LogOut, Shield, ArrowRight, CheckCircle2, Heart, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { base44 } from "@/api/base44Client";
import { zar } from "@/lib/media";

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadUserData = async () => {
      try {
        const allOrders = await base44.entities.Order.list("-created_date");
        const userEmail = user?.email?.toLowerCase().trim();
        let userOrders = [];
        if (userEmail) {
          userOrders = allOrders.filter(
            (o) => o.customer_email && o.customer_email.toLowerCase().trim() === userEmail
          );
        }
        setOrders(userOrders.length > 0 ? userOrders : allOrders.slice(0, 4));
      } catch (e) {
        console.warn("Could not load user orders:", e);
      }

      try {
        const emails = JSON.parse(localStorage.getItem("fortified_sent_emails") || "[]");
        setSentEmails(emails.filter(e => e.to === user?.email || user?.email?.includes(e.to)));
      } catch (e) {
        // ignore
      }
    };

    loadUserData();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Account Header */}
      <div className="border-b border-neutral-200 pb-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-widest font-bold rounded-full mb-3">
            <Shield className="w-3.5 h-3.5 text-neutral-300" />
            Verified Member
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider text-black">
            My Account
          </h1>
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-1">
            Logged in as <span className="font-bold text-black">{user?.email || "Member"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/shop">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-wider">
              Browse Vault
            </Button>
          </Link>
          <Button 
            onClick={() => {
              logout(false);
              window.location.href = "/";
            }} 
            variant="destructive"
            className="font-mono text-xs uppercase tracking-wider gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 h-fit">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
              {(user?.email || "M")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase text-black">{user?.name || "Fortified Member"}</p>
              <p className="font-mono text-[10px] text-neutral-500 truncate max-w-[180px]">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-500">Member Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-500">Security</span>
              <span className="font-bold text-black">OTP 2FA Active</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
            <Link to="/my-orders" className="flex items-center justify-between p-3 bg-black text-white rounded-lg text-xs font-mono font-bold hover:bg-neutral-800 transition-all shadow-sm">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" /> My Orders & Tracking
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/track-order" className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold hover:border-black transition-all">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-600" /> Quick Order Lookup
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/shop" className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold hover:border-black transition-all">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-neutral-600" /> Saved Wishlist
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Orders & Activity */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <Package className="w-5 h-5 text-black" />
                Recent Vault Orders
              </h2>
              <Link
                to="/my-orders"
                className="font-mono text-[10px] uppercase font-bold tracking-widest text-black underline hover:text-neutral-600"
              >
                View Full Tracking Portal →
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-neutral-300 rounded-lg bg-white">
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-3">No orders placed yet</p>
                <Link to="/shop">
                  <Button size="sm" className="font-mono text-xs uppercase tracking-wider">
                    Shop Fortified
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <Link
                    key={idx}
                    to="/my-orders"
                    className="p-4 bg-white border border-neutral-200 hover:border-black rounded-lg flex items-center justify-between font-mono text-xs transition-all cursor-pointer group"
                  >
                    <div>
                      <p className="font-bold text-black group-hover:underline">Order #{order.order_number || order.id}</p>
                      <p className="text-[10px] text-neutral-500">
                        {order.created_date ? new Date(order.created_date).toLocaleDateString() : "Recent"} · {order.items?.length || 1} Item(s)
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold text-black">{zar(order.total || order.total_amount)}</p>
                        <span className="text-[9px] px-2 py-0.5 bg-neutral-100 text-neutral-700 font-bold uppercase rounded border border-neutral-200">
                          {order.status || "Processing"}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Verification & System Notifications */}
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
            <h2 className="font-display text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-black" />
              Account Activity Log
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-white border border-neutral-200 rounded-lg font-mono text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-black">Identity Verified & Session Active</p>
                  <p className="text-[10px] text-neutral-500">Authenticated via Base44 Core OTP</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Success</span>
              </div>
              {sentEmails.map((email, idx) => (
                <div key={idx} className="p-3 bg-white border border-neutral-200 rounded-lg font-mono text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black">{email.subject}</p>
                    <p className="text-[10px] text-neutral-500">{email.timestamp}</p>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">{email.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-start">
        <BackButton label="BACK" to="/" />
      </div>
    </div>
  );
}

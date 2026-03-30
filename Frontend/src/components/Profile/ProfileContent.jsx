import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineClose,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { updateUser } from "../../redux/reducers/user";
import api from "../../api/axios";

const backendOrigin = (server || "http://localhost:5000").replace(/\/$/, "");

const resolveImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${backendOrigin}${img.startsWith("/") ? img : `/${img}`}`;
};

const ProfileContent = ({ active, user }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ── AVATAR HANDLERS ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setAvatarLoading(true);
    const data = new FormData();
    data.append("avatar", avatarFile);
    try {
      const res = await axios.put(`${server}/api/v2/user/update-avatar`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser(res.data.user));
      setAvatarPreview(null);
      setAvatarFile(null);
      fileInputRef.current.value = "";
      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update photo");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Remove your profile photo?")) return;
    setAvatarLoading(true);
    try {
      const res = await axios.delete(`${server}/api/v2/user/delete-avatar`, {
        withCredentials: true,
      });
      dispatch(updateUser(res.data.user));
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Profile photo removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove photo");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    fileInputRef.current.value = "";
  };

  /* ── PROFILE FORM ── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${server}/api/v2/user/update-profile`,
        {
          name: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
        { withCredentials: true }
      );
      dispatch(updateUser(res.data.user));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) {
      return resolveImage(user.avatar);
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* My Profile */}
      {active === 1 && (
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="relative">
              <img
                src={getAvatarSrc()}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt="profile"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=3ad132&color=fff&size=150`;
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={avatarLoading}
                title="Change photo"
                className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center cursor-pointer absolute -bottom-1 -right-1 shadow-md border hover:bg-gray-100 transition disabled:opacity-50"
              >
                <AiOutlineCamera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            {avatarFile ? (
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={avatarLoading}
                  className="px-4 py-1.5 bg-[#3ad132] text-white text-sm font-semibold rounded-lg hover:bg-[#2ebd28] transition disabled:opacity-50"
                >
                  {avatarLoading ? "Uploading..." : "Save Photo"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPreview}
                  disabled={avatarLoading}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            ) : user?.avatar ? (
              <button
                type="button"
                onClick={handleAvatarDelete}
                disabled={avatarLoading}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition disabled:opacity-50"
              >
                <AiOutlineDelete size={16} />
                {avatarLoading ? "Removing..." : "Remove Photo"}
              </button>
            ) : null}
          </div>
          <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} readOnly placeholder="Email cannot be changed" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter your phone number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition" />
            </div>
            <div>
              <button type="submit" disabled={loading} className="px-8 py-2 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Books */}
      {active === 2 && <MyBooks />}

      {/* Orders Placed (buyer) */}
      {active === 3.1 && <BuyerOrders />}

      {/* Orders Received (seller) */}
      {active === 3.2 && <SellerOrders />}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MY BOOKS — full CRUD
═══════════════════════════════════════════ */
const bookStatusColors = {
  Available: "bg-green-100 text-green-800",
  Under_Review: "bg-yellow-100 text-yellow-800",
  Sold: "bg-blue-100 text-blue-800",
  Reserved: "bg-purple-100 text-purple-800",
  Rejected: "bg-red-100 text-red-800",
  Exchanged: "bg-indigo-100 text-indigo-800",
};

const conditionOptions = ["Like New", "Good", "Fair", "Acceptable"];

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/v2/book/user/my-books");
      setBooks(res.data.books);
    } catch (err) {
      toast.error("Failed to fetch your books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    api
      .get("/v2/category/all")
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const handleDelete = async (bookId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/v2/book/${bookId}`);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Book deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleFormDone = (savedBook, isNew) => {
    if (isNew) {
      setBooks((prev) => [savedBook, ...prev]);
    } else {
      setBooks((prev) => prev.map((b) => (b._id === savedBook._id ? savedBook : b)));
    }
    setShowForm(false);
    setEditingBook(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showForm) {
    return (
      <BookForm
        book={editingBook}
        categories={categories}
        onDone={handleFormDone}
        onCancel={() => {
          setShowForm(false);
          setEditingBook(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          My Books <span className="text-[#D98C00]">({books.length})</span>
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition shadow-sm"
        >
          <AiOutlinePlus size={18} />
          Upload Book
        </button>
      </div>

      {books.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-lg text-gray-500 mb-2">You haven't uploaded any books yet.</p>
          <p className="text-sm text-gray-400 mb-6">
            Start selling by uploading your first book.
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
          >
            Upload Your First Book
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4"
            >
              <img
                src={resolveImage(book.image)}
                alt={book.title}
                className="w-20 h-24 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x100?text=Book";
                }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-gray-400">by {book.author}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      bookStatusColors[book.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {book.status?.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <span className="font-medium text-gray-700">Price:</span> Rs. {book.price}
                  </span>
                  <span>
                    <span className="font-medium text-gray-700">Condition:</span> {book.condition}
                  </span>
                  {book.category?.name && (
                    <span>
                      <span className="font-medium text-gray-700">Category:</span>{" "}
                      {book.category.name}
                    </span>
                  )}
                  {book.exchangeable && (
                    <span className="text-blue-600 font-medium text-xs">Exchangeable</span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[#D98C00] border border-[#D98C00] rounded-lg hover:bg-[#D98C00]/10 transition"
                  >
                    <AiOutlineEdit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id, book.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition"
                  >
                    <AiOutlineDelete size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   BOOK FORM — create & edit
═══════════════════════════════════════════ */
const BookForm = ({ book, categories, onDone, onCancel }) => {
  const isEdit = !!book;

  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [description, setDescription] = useState(book?.description || "");
  const [price, setPrice] = useState(book?.price || "");
  const [category, setCategory] = useState(book?.category?._id || book?.category || "");
  const [condition, setCondition] = useState(book?.condition || "");
  const [exchangeable, setExchangeable] = useState(book?.exchangeable || false);
  const [edition, setEdition] = useState(book?.edition || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    isEdit ? resolveImage(book?.image) : null
  );
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !description || !price || !category || !condition) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isEdit && !imageFile) {
      toast.error("Please upload a book image");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("exchangeable", exchangeable);
    formData.append("edition", edition);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let res;
      if (isEdit) {
        res = await api.put(`/v2/book/${book._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/v2/book/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(isEdit ? "Book updated!" : "Book uploaded!");
      onDone(res.data.book, !isEdit);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isEdit ? "Edit Book" : "Upload New Book"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
        >
          <AiOutlineClose size={22} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
      >
        {/* Row 1: Title & Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
              placeholder="Enter book title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
              placeholder="Enter author name"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
            placeholder="Describe the book's condition, content, etc."
            required
          />
        </div>

        {/* Row 2: Price & Edition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price (PKR) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
              placeholder="e.g. 350"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Edition
            </label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
              placeholder="e.g. 3rd Edition"
            />
          </div>
        </div>

        {/* Row 3: Category & Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none bg-white"
            >
              <option value="">-- Select --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Condition *
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {conditionOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCondition(opt)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    condition === opt
                      ? "bg-[#D98C00] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Book Image {isEdit ? "" : "*"}
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-20 h-24 object-contain bg-gray-50 rounded-lg border"
              />
            )}
            <label className="cursor-pointer px-4 py-2 border-2 border-dashed border-[#D98C00] rounded-lg text-sm font-medium text-[#D98C00] hover:bg-[#D98C00]/5 transition">
              {imagePreview ? "Change Image" : "Choose Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Exchangeable */}
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <input
            type="checkbox"
            checked={exchangeable}
            onChange={(e) => setExchangeable(e.target.checked)}
            className="w-5 h-5 accent-[#D98C00]"
            id="exchangeable-check"
          />
          <label htmlFor="exchangeable-check" className="text-sm font-medium text-gray-700">
            This book is exchangeable
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition disabled:opacity-50"
          >
            {submitting
              ? isEdit
                ? "Saving..."
                : "Uploading..."
              : isEdit
              ? "Save Changes"
              : "Upload Book"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

/* ═══════════════════════════════════════════
   BUYER ORDERS COMPONENT
═══════════════════════════════════════════ */
const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/v2/order/my-orders");
        setOrders(res.data.orders);
      } catch (err) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-lg text-gray-500 mb-2">No orders placed yet.</p>
        <p className="text-sm text-gray-400">Start shopping to see your orders here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Placed</h2>
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} role="buyer" />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   SELLER ORDERS COMPONENT
═══════════════════════════════════════════ */
const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/v2/order/seller-orders");
        setOrders(res.data.orders);
      } catch (err) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/v2/order/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-lg text-gray-500 mb-2">No orders received yet.</p>
        <p className="text-sm text-gray-400">Orders for your books will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Received</h2>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          role="seller"
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   ORDER CARD COMPONENT
═══════════════════════════════════════════ */
const orderStatusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const nextStatusMap = {
  Pending: "Confirmed",
  Confirmed: "Shipped",
  Shipped: "Delivered",
};

const OrderCard = ({ order, role, onStatusUpdate }) => {
  const book = order.book;
  const otherParty = role === "buyer" ? order.seller : order.buyer;
  const nextStatus = nextStatusMap[order.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex gap-4">
        <img
          src={resolveImage(book?.image) || "https://via.placeholder.com/80x100?text=Book"}
          alt={book?.title}
          className="w-20 h-24 object-contain bg-gray-50 rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-800">{book?.title}</h3>
              <p className="text-xs text-gray-400">by {book?.author}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                orderStatusColors[order.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
            <p><span className="font-medium text-gray-700">Price:</span> Rs. {order.price}</p>
            <p><span className="font-medium text-gray-700">Payment:</span> {order.paymentMethod}</p>
            <p><span className="font-medium text-gray-700">{role === "buyer" ? "Seller" : "Buyer"}:</span> {otherParty?.name}</p>
            <p><span className="font-medium text-gray-700">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium text-gray-600">Ship to:</span>{" "}
            {order.shippingAddress?.fullName}, {order.shippingAddress?.address},{" "}
            {order.shippingAddress?.city}
            {order.shippingAddress?.zip ? ` - ${order.shippingAddress.zip}` : ""}
          </div>
          {role === "seller" &&
            order.status !== "Delivered" &&
            order.status !== "Cancelled" && (
              <div className="mt-3 flex gap-2">
                {nextStatus && (
                  <button
                    onClick={() => onStatusUpdate(order._id, nextStatus)}
                    className="px-4 py-1.5 text-sm font-semibold bg-[#D98C00] text-white rounded-lg hover:bg-[#A86500] transition"
                  >
                    Mark as {nextStatus}
                  </button>
                )}
                <button
                  onClick={() => onStatusUpdate(order._id, "Cancelled")}
                  className="px-4 py-1.5 text-sm font-semibold bg-white text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;

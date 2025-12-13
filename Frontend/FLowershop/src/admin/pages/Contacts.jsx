import { useEffect, useState } from "react";
import API from "../../Api/axiosInstance";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const loadContacts = () => {
    setLoading(true);
    API.get("admin/contacts/")
      .then((res) => {
        setContacts(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load contact messages");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.patch("admin/contacts/", { id });
      loadContacts();
    } catch (err) {
      console.error(err);
      setError("Failed to mark as read");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await API.delete("admin/contacts/", { data: { id } });
      loadContacts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete message");
    }
  };

  const filteredContacts = contacts.filter((c) => {
    if (filter === "unread") return !c.is_read;
    if (filter === "read") return c.is_read;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading contact messages...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-pink-600">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {contacts.length} | Unread: {unreadCount}
          </p>
        </div>
        <button
          onClick={loadContacts}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            filter === "all"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All ({contacts.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            filter === "unread"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            filter === "read"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Read ({contacts.filter((c) => c.is_read).length})
        </button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          {filter === "all" ? "No contact messages yet" : `No ${filter} messages`}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition hover:shadow-lg ${
                contact.is_read
                  ? "border-l-gray-300 bg-gray-50"
                  : "border-l-pink-500 bg-pink-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {contact.name}
                    </h3>
                    {!contact.is_read && (
                      <span className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full whitespace-nowrap">
                        🔔 New
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-1 break-all">
                    <strong>📧 Email:</strong> <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">{contact.email}</a>
                  </p>

                  <p className="text-sm text-gray-600 mb-3">
                    <strong>📅 Date:</strong>{" "}
                    {new Date(contact.created_at).toLocaleString()}
                  </p>

                  <div className="mt-4 p-4 bg-white rounded border border-gray-200 max-h-20 overflow-hidden">
                    <p className="text-gray-700 line-clamp-3">
                      {contact.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-max">
                  {!contact.is_read && (
                    <button
                      onClick={() => markAsRead(contact.id)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm whitespace-nowrap font-medium"
                    >
                      ✓ Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-xs sm:text-sm whitespace-nowrap font-medium"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm whitespace-nowrap font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing full message */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-pink-600">
                {selectedContact.name}
              </h3>
              {!selectedContact.is_read && (
                <span className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full">
                  Unread
                </span>
              )}
            </div>

            <div className="space-y-4 mb-6 border-b pb-4">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>📧 Email:</strong>{" "}
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-500 hover:underline">
                    {selectedContact.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>📅 Date:</strong>{" "}
                  {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedContact.message}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {!selectedContact.is_read && (
                <button
                  onClick={() => {
                    markAsRead(selectedContact.id);
                    setSelectedContact(null);
                  }}
                  className="flex-1 min-w-fit px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  deleteContact(selectedContact.id);
                  setSelectedContact(null);
                }}
                className="flex-1 min-w-fit px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 min-w-fit px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
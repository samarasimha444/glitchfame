import React, { useState, useEffect, useCallback } from "react";
import {
  UserPlus,
  Trash2,
  Search,
  Loader2,
  ListFilter,
  ChevronDown,
} from "lucide-react";
import {
  useDeleteContestant,
  useLiveContestants,
  useSearchContestants,
  useVoteContestant,
} from "../hook";

import VoteModal from "./VoteModel";
import toast from "react-hot-toast";
import NeonLoader from "../../../../components/NeonLoader";
import { TableRow } from "./TableRow";
import { TableShimmer } from "../../../../components/TableShimmer";
import NewModel from "../../../../components/NewModel";

const UserTable = ({ className, setLive }) => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowtModal] = useState(false);
  const [order, setOrder] = useState("desc");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [activeItem, setActiveItem] = useState({
    participationId: null,
    seasonId: null,
  });

  const { data, isLoading: liveLoading } = useLiveContestants(
    page,
    size,
    order,
  );

  const total = data?.totalElements;

  useEffect(() => {
    if (total !== undefined) {
      setLive(total);
    }
  }, [total, setLive]);

  useEffect(() => {
    setPage(0);
  }, [size]);

  const { data: searchData, isLoading: searching } =
    useSearchContestants(debouncedSearch);

  const { mutate: vote } = useVoteContestant();
  const { mutate: deleteUser } = useDeleteContestant();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const contestants =
    debouncedSearch && searchData ? searchData?.content : data?.content;

  const handleVote = useCallback(
    (participationId, seasonId, votes) => {
      vote(
        { participationId, seasonId, value: votes },
        {
          onSuccess: () => {
            toast.success("Vote submitted successfully");
            setActiveItem({
              participationId: null,
              seasonId: null,
            });
          },
          onError: () => {
            toast.error("Failed to submit vote");
          },
        },
      );
    },
    [vote],
  );

  const handleDelete = useCallback((id) => {
    setDeleteId(id);
    setShowtModal(true);
  }, []);

  const confirmDelete = () => {
    if (!deleteId) return;

    deleteUser(deleteId, {
      onSuccess: () => {
        toast.success("Deleted successfully");
        setShowtModal(false);
        setDeleteId(null);
      },
      onError: () => {
        toast.error("Failed to delete");
      },
    });
  };

  const totalPages = data?.totalPages || 0;
  const isLoading = liveLoading;

  const getPages = () => {
    const pages = [];

    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);

    if (start > 0) {
      pages.push(0);
      if (start > 1) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const sizeOptions =
    total ? [5, 10, 20, 50, 100].filter((num) => num <= total) : [5, 10, 20];

  return (
    <div className={`flex flex-col ${className || "w-full"}`}>
      <NewModel
        isOpen={showModal}
        onClose={() => {
          setShowtModal(false);
          setDeleteId(null);
        }}
        onSubmit={confirmDelete} // ✅ IMPORTANT CHANGE
        title="Delete Contestant"
        message="Are you sure you want to delete this contestant?"
      />

      <VoteModal
        open={activeItem.participationId !== null}
        credentials={activeItem}
        onClose={() =>
          setActiveItem({
            participationId: null,
            seasonId: null,
          })
        }
        onSubmit={handleVote}
      />

      <div className="relative w-full mt-12 border border-gray-700 p-4 sm:p-8 rounded-lg bg-[#111418]">
        <section className="flex flex-wrap items-center justify-between w-full mb-6 gap-3">
          <h3 className="text-[16px] sm:text-xl flex items-center gap-2 font-semibold">
            <UserPlus /> Active <br className="xs:hidden" /> Contestants
          </h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-60 h-10 sm:h-9 pl-9 pr-8 text-sm bg-[#141821] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
              {searching && (
                <Loader2
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
                />
              )}
            </div>

            <div className="relative group">
              <button className="flex items-center justify-center gap-2 h-10 sm:h-9 px-3 rounded-lg bg-[#141821] border border-gray-700 text-gray-400 hover:text-blue-400 transition-all">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span className="hidden xs:inline">Show: </span>
                  <span className="text-white">{size}</span>
                </span>
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform hidden sm:block"
                />
              </button>

              {/* Dropdown - Right aligned on mobile to prevent clipping */}
              <div className="absolute top-full mt-1 right-0 sm:left-0 min-w-[70px] bg-[#141821] border border-gray-700 rounded-lg shadow-xl hidden group-hover:block z-50 overflow-hidden">
                {sizeOptions.map((num) => (
                  <div
                    key={num}
                    onClick={() => setSize(num)}
                    className="px-4 py-3 sm:py-2 text-sm sm:text-xs text-center sm:text-left text-gray-400 hover:bg-blue-500/10 sm:hover:text-blue-400 sm:cursor-pointer transition-colors"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Sort Button */}
            <button
              onClick={() =>
                setOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="flex items-center justify-center gap-2 h-10 sm:h-9 px-3 rounded-lg bg-[#141821] border border-gray-700 text-gray-400 sm:hover:text-blue-400 transition-all active:scale-95"
            >
              <ListFilter size={15} />

              <span className="hidden sm:inline text-[10px] sm:text-xs font-bold uppercase tracking-wider min-w-[55px] text-left">
                {order === "desc" ? "Trending" : "Rookie"}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${order === "asc" ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </section>

        <div className="overflow-x-auto max-h-[70vh] sm:max-h-none">
          <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#0f121a]/50 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30 text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest">
                  <th className="px-4 py-4 font-bold">Contestant</th>
                  <th className="py-4 hidden sm:table-cell font-bold text-right px-2">
                    Season{" "}
                  </th>
                  <th className="py-4 font-bold text-right px-">Stats</th>
                  <th className="px-4 py-4 text-right font-bold">Manage</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/50">
                {isLoading ?
                  <tr>
                    <td colSpan="4" className="py-20">
                      <div className="flex justify-center h-[20dvh] items-center">
                        <TableShimmer />
                      </div>
                    </td>
                  </tr>
                : contestants?.length === 0 ?
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-gray-500 py-12 italic"
                    >
                      No contestants active in this category
                    </td>
                  </tr>
                : contestants?.map((item) => (
                    <TableRow
                      key={item.participationId}
                      item={item}
                      onVote={handleVote}
                      onDelete={handleDelete}
                      setActive={setActiveItem}
                    />
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <section className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          {getPages().map((p, index) =>
            p === "..." ?
              <span key={index} className="px-2 text-gray-400">
                ...
              </span>
            : <button
                key={index}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === p ?
                    "bg-blue-500 text-white"
                  : "bg-[#141821] text-gray-300 hover:bg-gray-700"
                }`}
              >
                {p + 1}
              </button>,
          )}

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </section>
      </div>
    </div>
  );
};

export default UserTable;

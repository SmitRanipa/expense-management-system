"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface People {
  PeopleID: number;
  PeopleName: string;
  Email: string;
  MobileNo: string;
  IsActive: boolean | null;
}

export default function PeoplesPage() {
  const router = useRouter();

  const [peoples, setPeoples] = useState<People[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionId, setActionId] = useState<number | null>(null);


  useEffect(() => {
    async function fetchPeoples() {
      try {
        const res = await fetch("/api/admin/peoples");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load peoples");
          return;
        }

        setPeoples(data.data);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchPeoples();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>Peoples</h1>

        <Link href="/admin/peoples/add">
          <button>Add People</button>
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Mobile</th>
              <th align="left">Status</th>
              <th align="left">Action</th>
            </tr>
          </thead>

          <tbody>
            {peoples.length === 0 && (
              <tr>
                <td colSpan={4}>No peoples found</td>
              </tr>
            )}

            {peoples.map((p) => (
              <tr key={p.PeopleID}>
                <td>{p.PeopleName}</td>
                <td>{p.Email}</td>
                <td>{p.MobileNo}</td>
                <td>{p.IsActive ? "Active" : "Inactive"}</td>
                <td>
                  {/* ✏️ EDIT */}
                  <button
                    onClick={() =>
                      router.push(`/admin/peoples/edit/${p.PeopleID}`)
                    }
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>

                  {/* 🔁 ACTIVATE / DEACTIVATE */}
                  <button
                    disabled={actionId === p.PeopleID}
                    onClick={async () => {
                      setActionId(p.PeopleID);

                      await fetch("/api/admin/peoples", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ PeopleID: p.PeopleID }),
                      });

                      setPeoples((prev) =>
                        prev.map((person) =>
                          person.PeopleID === p.PeopleID
                            ? {
                                ...person,
                                IsActive:
                                  person.IsActive === true ? false : true,
                              }
                            : person,
                        ),
                      );

                      setActionId(null);
                    }}
                  >
                    {actionId === p.PeopleID
                      ? "Processing..."
                      : p.IsActive === true
                        ? "Deactivate"
                        : "Activate"}
                  </button>

                  {/* 🗑️ DELETE */}
                  <button
                    onClick={async () => {
                      if (
                        !confirm("Are you sure you want to delete this person?")
                      )
                        return;

                      await fetch(`/api/admin/peoples?id=${p.PeopleID}`, {
                        method: "DELETE",
                      });

                      setPeoples((prev) =>
                        prev.filter((person) => person.PeopleID !== p.PeopleID),
                      );
                    }}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import useToast from "../common/Toast";
import api from "../../api";

export default function AllUsers() {
  const [toastElement, showToast] = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const res = await api.get("/admin/getallusers");
      if (res.data.success) setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleStatus = async (userid, status) => {
    try {
      const res = await api.post("/admin/handlestatus", { userid, status });
      if (res.data.success) {
        showToast(res.data.message, "success");
        getUsers();
      } else {
        showToast(res.data.message, "danger");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal ubah status", "danger");
    }
  };

  return (
    <div className="card-dark p-3">
      {toastElement}

      {loading ? (
        <p className="text-center text-secondary my-3">Loading...</p>
      ) : (
        <Table responsive bordered className="table-dark-custom align-middle text-center mb-0">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Granted (Owners Only)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td><small>{u._id}</small></td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ color: "var(--brand)" }}>{u.type}</td>
                <td className={u.granted === "granted" ? "text-available" : "text-unavailable"}>
                  {u.type === "Owner" ? u.granted : ""}
                </td>
                <td>
                  {u.type === "Owner" &&
                    (u.granted === "granted" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatus(u._id, "ungranted")}
                      >
                        Ungrant
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatus(u._id, "granted")}
                      >
                        Grant
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
// import MaterialTable from "material-table";
import {
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Checkbox,
  TablePagination,
  Input,
} from "@material-ui/core";
import { DeleteOutlined, Edit, Save } from "@material-ui/icons";

function UserTable({
  data = [],
  filterData = [],
  onEdit,
  onDelete,
  onSelectAll,
  onSelect = [],
  handlePageChange,
  handleRowsPerPageChange,
  page,
  rowsPerPage,
}) {
  const columns = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Role", field: "role" },
  ];
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  //For Going in any pages
  useEffect(() => {
    let arr = [];
    let p = data.length / rowsPerPage;
    let p1 = Math.floor(p);
    if (p > p1) {
      p1 += 1;
    }
    for (let i = 1; i <=p1; i++) {
      arr.push(i);
    }
    setPages(arr);
    setLoading(false);
    console.log({ p1, pages });
  }, []);

  const [selectedData, setSelectedData] = useState(null);
  const handleSave = () => {
    if (!selectedData) return;
    onEdit(selectedData);
    setSelectedData(null);
  };

  return loading ? (
    "Loading..."
  ) : (
    <>
      <TableContainer style={{ maxHeight: "70vh" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bolder" }}>
                <Checkbox
                  checked={data.filter((d) => d.isSelect === true).length > 0}
                  onChange={() =>
                    onSelectAll(
                      data.filter((d) => d.isSelect === true).length > 0
                    )
                  }
                  inputProps={{ "aria-label": "controlled" }}
                />
                ({data.filter((d) => d.isSelect === true).length}/{data.length})
              </TableCell>
              {columns.map((col, i) => (
                <TableCell
                  style={{ fontWeight: "bolder" }}
                  key={i}
                  className="abc"
                >
                  {col.title}
                </TableCell>
              ))}
              <TableCell style={{ fontWeight: "bolder" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // data
              filterData.map((info, i) => {
                return selectedData?.id === info?.id ? (
                  // Handling Edit funcionality
                  <TableRow key={i}>
                    <TableCell>
                      <Checkbox checked={info.isSelect} disabled />
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={info.name}
                        onChange={(e) =>
                          setSelectedData({
                            ...selectedData,
                            name: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={info.email}
                        onChange={(e) =>
                          setSelectedData({
                            ...selectedData,
                            email: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={info.role}
                        onChange={(e) =>
                          setSelectedData({
                            ...selectedData,
                            role: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Save onClick={handleSave} />
                    </TableCell>
                  </TableRow>
                ) : (
                  // Rendering the data
                  <TableRow
                    style={{
                      backgroundColor: info.isSelect ? "LightGray" : "white",
                    }}
                    key={i}
                  >
                    <TableCell>
                      <Checkbox
                        checked={info.isSelect}
                        onChange={() => {
                          onSelect({ id: info?.id, isSelect: info.isSelect });
                        }}
                      />
                    </TableCell>
                    <TableCell>{info?.name}</TableCell>
                    <TableCell>{info?.email}</TableCell>
                    <TableCell>{info?.role}</TableCell>
                    <TableCell>
                      <Edit
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedData(info)}
                      />
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => onDelete(info?.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
{/* Table Pagination */}
      <TablePagination
        rowsPerPage={rowsPerPage}
        count={data.length}
        page={page}
        rowsPerPageOptions={[10, 20, 30, 50, 100]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

{/* Handling Page changes with buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {pages.map((pg, i) => {
          return (
            <div
              onClick={() => handlePageChange(null, pg)}
              key={i}
              className="pg"
            >
              {pg}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default UserTable;

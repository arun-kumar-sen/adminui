import { Button, Input } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable";

function App() {
  const [state, setState] = useState({
    isLoading: true,
    data: [],
    filterData: [],
    selected: null,
    page: 0,
    rowsPerPage: 10,
    startIndex: 0,
    checked: false,
    search: "",
  });

  //Getting the data from API
  useEffect(() => {
    async function load() {
      const res = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      ).then((res) => res.json());

      const arr = res.map((info) => {
        return {
          ...info,
          isSelect: false,
        };
      });

      console.log(arr);

      return setState({
        ...state,
        isLoading: false,
        data: arr,
        filterData: sliceData(arr),
        search: "",
      });
    }
    load();
  }, []);

  useEffect(() => {
    return setState({
      ...state,
      filterData: sliceData(state.data),
    });
  }, [state.page, state.rowsPerPage]);

  //Edit functionality
  const onEdit = (arg) => {
    let arr = state.data.map((info) => {
      if (info.id === arg.id) {
        return { ...arg };
      }
      return { ...info };
    });

    setState({ ...state, data: arr, filterData: sliceData(arr) });
  };

  //Delete functionality
  const onDelete = (id) => {
    let arr = [];
    state.data.forEach((info) => {
      if (info.id !== id) {
        arr.push({ ...info });
      }
    });

    console.log({ arr });
    let new_filter_data = sliceData(arr);
    setState({ ...state, data: arr, filterData: new_filter_data });
  };

  //Select functionality
  const onSelect = ({ id, isSelect, e }) => {
    let arr = state.data.map((info) => {
      return {
        ...info,
        isSelect: info.id === id ? !isSelect : info.isSelect,
      };
    });
    setState({
      ...state,
      data: arr,
      filterData: sliceData(arr),
    });
  };

  //Select All functionality
  const onSelectAll = (flag) => {
    let arr = [];
    if (flag === true) {
      state.data.forEach((info) => {
        arr.push({
          ...info,
          isSelect: false,
        });
      });

      return setState({ ...state, data: arr, filterData: sliceData(arr) });
    }

    arr = sliceData(state.data);
    let new_selected = arr.map((info) => {
      return {
        ...info,
        isSelect: true,
      };
    });

    let new_data = [];
    state.data.forEach((info) => {
      new_data.push({
        ...info,
        isSelect:
          new_selected.filter((d) => d.id === info.id).length > 0
            ? true
            : false,
      });
    });

    setState({ ...state, data: new_data, filterData: new_selected });
  };

  //Delete Selected  functionality
  const deleteAll = () => {
    let arr = [];
    state.data.forEach((info) => {
      if (info.isSelect === false) {
        arr.push({ ...info });
      }
    });
    setState({ ...state, data: arr, filterData: sliceData(arr) });
  };

  const handlePageChange = (e, pg) => {
    console.log("set page: ", pg);
    // let count = state.page;
    let newCount = pg + state.rowsPerPage;
    console.log(newCount);
    if (newCount > state.data.length) return;

    setState({
      ...state,
      page: pg,
      startIndex:
        state.page < pg
          ? state.startIndex + state.rowsPerPage
          : state.startIndex - state.rowsPerPage,
    });
  };

  const handleRowsPerPageChange = (e) => {
    setState({ ...state, rowsPerPage: e?.target?.value });
  };

  const sliceData = (arr = []) => {
    return arr.slice(state.startIndex, state.startIndex + state.rowsPerPage);
    // return arr.slice();
  };

  useEffect(() => {
    if (state.data.length === 0) {
      setState({ ...state, page: 0, rowsPerPage: 10 });
    }
  }, [state.data]);

  //Implementing the search functionality
  useEffect(() => {
    setState({
      ...state,
      filterData: sliceData(
        state.data.filter(
          (d) =>
            d.name.toLowerCase().includes(state.search?.toLowerCase()) ||
            d.email.toLowerCase().includes(state.search?.toLowerCase()) ||
            d.role.toLowerCase().includes(state.search?.toLowerCase())
        )
      ),
    });
  }, [state.search]);

  return (
    <div>
      {state.isLoading ? (
        "Loading..."
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Input
              placeholder="Search.."
              value={state.search}
              onChange={(e) => setState({ ...state, search: e.target.value })}
            />
            <Button
              disabled={
                state.data.filter((d) => d.isSelect === true).length === 0
              }
              onClick={deleteAll}
              style={{
                backgroundColor: "red",
                borderRadius: "20px",
                color: "whitesmoke",
                margin: "10px",
              }}
            >
              Delete Selected
            </Button>
          </div>
          <div>
            <UserTable
              data={state.data}
              filterData={state.filterData}
              page={state.page}
              rowsPerPage={state.rowsPerPage}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
              onSelectAll={onSelectAll}
              handlePageChange={handlePageChange}
              handleRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;

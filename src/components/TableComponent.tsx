import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Box
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: "asc" | "desc", orderBy: string) {
  return order === "desc"
    ? (a: Record<string, unknown>, b: Record<string, unknown>) =>
        descendingComparator(a, b, orderBy)
    : (a: Record<string, unknown>, b: Record<string, unknown>) =>
        -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis: [T, number][] = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0] as T, b[0] as T);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface TableComponentProps {
  data: { [key: string]: string | number | null }[];
  columns: { Header: string; accessor: string }[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data, columns }) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const filteredData = data?.filter((item) => {
    if (!search) return true;

    return Object.values(item).some((value) => {
      if (value === null) return false;

      const valueStr = String(value).toLowerCase();
      return valueStr.includes(search.toLowerCase());
    });
  });

  const sortedData = orderBy
    ? stableSort(filteredData, getComparator(order, orderBy))
    : filteredData;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: 3,
        borderRadius: "8px",
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{
          marginBottom: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          },
        }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.accessor}
                  sortDirection={orderBy === column.accessor ? order : false}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column.accessor}
                    direction={orderBy === column.accessor ? order : "asc"}
                    onClick={(event) =>
                      handleRequestSort(event, column.accessor)
                    }
                  >
                    {column.Header}
                    {orderBy === column.accessor ? (
                      <span style={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={
                      row.Hiring_TestID?.toString() || Math.random().toString()
                    }
                    onClick={() => handleRowClick(row)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.accessor}
                        sx={{
                          padding: "12px 16px",
                          textAlign: "center",
                          fontSize: "14px",
                        }}
                      >
                        {row[column.accessor] !== null
                          ? row[column.accessor]
                          : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ padding: "20px", fontSize: "16px" }}
                >
                  No results found for &quot;{search}&quot;
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={filteredData.length === 0 ? 0 : page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          marginTop: "20px",
        }}
      />
    </Box>
  );
};

export default TableComponent;

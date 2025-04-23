import { useState, useEffect } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import MapIcon from "@mui/icons-material/Map";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TableComponent from "./TableComponent";
import MapComponent from "./MapComponent";
import Loader from "./Loader";
import EmployeeForm from "./AddEmployee";

const TabsComponent = ({
  employees,
  employeesLocation,
  isLoading,
  columns,
}) => {
  const [viewMode, setViewMode] = useState("table");
  const [contentHeight, setContentHeight] = useState("calc(100vh - 200px)");

  useEffect(() => {
    const updateContentHeight = () => {
      const headerHeight = document.querySelector("h1")?.offsetHeight || 48;
      const tabsHeight =
        document.querySelector(".MuiTabs-root")?.offsetHeight || 48;
      const padding = 40;
      const newHeight = `calc(100vh - ${
        headerHeight + tabsHeight + padding
      }px)`;
      setContentHeight(newHeight);
    };

    updateContentHeight();
    window.addEventListener("resize", updateContentHeight);

    return () => window.removeEventListener("resize", updateContentHeight);
  }, []);

  const handleTabChange = (event, newValue) => {
    setViewMode(newValue);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (employees.length === 0) {
      return (
        <Typography variant="h6" textAlign="center">
          No Data Found
        </Typography>
      );
    }

    switch (viewMode) {
      case "table":
        return (
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: contentHeight,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
              <TableComponent data={employees} columns={columns} />
            </Box>
          </Paper>
        );
      case "map":
        return (
          <Box
            sx={{
              height: contentHeight,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <MapComponent locations={employeesLocation} />
          </Box>
        );
      case "add":
        return (
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              height: contentHeight,
              overflow: "auto",
            }}
          >
            <EmployeeForm />
          </Paper>
        );
      default:
        return <TableComponent data={employees} columns={columns} />;
    }
  };

  return (
    <>
      <Tabs
        value={viewMode}
        onChange={handleTabChange}
        aria-label="View Mode Tabs"
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
          },
          "& .MuiTabs-flexContainer": {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          },
          mb: 2,
          "@media (max-width: 600px)": {
            "& .MuiTab-root": {
              fontSize: "0.875rem",
              padding: "4px 8px",
            },
            "& .MuiTab-labelIcon": {
              minHeight: "30px",
            },
          },
        }}
      >
        <Tab
          value="table"
          label="EMPLOYEES TABLE"
          icon={<TableViewIcon />}
          iconPosition="start"
        />
        <Tab
          value="map"
          label="MAP VIEW"
          icon={<MapIcon />}
          iconPosition="start"
        />
        <Tab
          value="add"
          label="ADD EMPLOYEE"
          icon={<PersonAddIcon />}
          iconPosition="start"
        />
      </Tabs>

      <Box
        sx={{
          width: "100%",
          padding: { xs: 0, sm: 3, md: 5 },
          margin: { xs: 0 },
        }}
      >
        {renderContent()}
      </Box>
    </>
  );
};

export default TabsComponent;

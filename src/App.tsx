import { useEffect, useState, useRef } from "react";
import "./App.css";
import { getEmployees } from "./service";
import { filterLocation } from "./utils";
import { Box, Grid, Snackbar, Alert } from "@mui/material";
import { columns } from "./constant";
import TabsComponent from "./components/TabsComponent";

function App() {
  const [employees, setEmployees] = useState([]);
  const [employeesLocation, setEmployeesLocation] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const effectRan = useRef(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const getEmployeesData = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
      const locations = filterLocation(data);
      setEmployeesLocation(locations);
      setSnackbarMessage("Data loaded successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to fetch employees");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      getEmployeesData();
      effectRan.current = true;
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          padding: { xs: 0, sm: 3, md: 5 },
          boxShadow: "none",
          "& .MuiPaper-root": {
            boxShadow: "none !important",
            borderRadius: "0 !important",
          },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            maxWidth: "100%",
            margin: "0 auto",
            width: "100%",
            paddingX: { xs: 0, sm: 3 },
            overflowX: "hidden",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <TabsComponent
              employees={employees}
              employeesLocation={employeesLocation}
              isLoading={isLoading}
              columns={columns}
            />
          </Grid>
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default App;

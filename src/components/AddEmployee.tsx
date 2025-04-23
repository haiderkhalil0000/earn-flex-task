import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import { addEmployee } from "../service";
import { z } from "zod";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Enter a valid email address")
    .min(1, "Email is required"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,15}$/, "Enter a valid phone number (10-15 digits)")
    .min(1, "Phone number is required"),
  employeeID: z.string().min(1, "Employee ID is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
});

const EmployeeForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    latitude: "",
    longitude: "",
    employeeID: "",
    city: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [locationError, setLocationError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData, locationError, touched]);

  const getUserLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setLocationError("");
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Location access is required to submit the form.");
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const validateForm = () => {
    try {
      employeeSchema.parse(formData);
      setErrors({});
      setFormValid(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(newErrors);
        setFormValid(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    if (!formValid) {
      setSnackbar({
        open: true,
        message: "Please fix all errors before submitting",
        severity: "error",
      });
      return;
    }

    try {
      const addEmployeeResponse = await addEmployee(formData);
      if (addEmployeeResponse.Hiring_TestID) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          latitude: formData.latitude,
          longitude: formData.longitude,
          employeeID: "",
          city: "",
          country: "",
        });
        setSnackbar({
          open: true,
          message: "Employee added successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to submit form. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit form. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const fields = [
    { name: "firstName", label: "First Name", icon: <PersonIcon /> },
    { name: "lastName", label: "Last Name", icon: <PersonIcon /> },
    { name: "email", label: "Email", type: "email", icon: <EmailIcon /> },
    { name: "phoneNumber", label: "Phone Number", type: "tel", icon: <PhoneIcon /> },
    { name: "employeeID", label: "Employee ID", icon: <BadgeIcon /> },
    { name: "city", label: "City", icon: <LocationCityIcon /> },
    { name: "country", label: "Country", icon: <PublicIcon /> },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: "16px 0", sm: "16px 0" },
        width: "100%", 
        mx: "auto",
        my: 0,
        borderRadius: 0,
        border: "1px solid #e0e0e0",
        borderLeft: 0,
        borderRight: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          px: { xs: 2, sm: 2, md: 3 },
          pt: { xs: 1, sm: 2 }
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          align="left"
          gutterBottom
          fontWeight="bold"
          sx={{ 
            mb: 3,
            wordBreak: "break-word",
            fontSize: {
              xs: '1.75rem',
              sm: '2rem',
              md: '2.125rem'
            },
            pl: 0
          }}
        >
          Please Fill the Form
        </Typography>

        {locationError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, mx: 0 }}
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={getUserLocation}
                sx={{ ml: isMobile ? 0 : 2, mt: isMobile ? 1 : 0 }}
              >
                Try Again
              </Button>
            }
          >
            {locationError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ pl: 0 }}>
          <Grid container spacing={isMobile ? 1 : 2} sx={{ ml: 0, width: "100%" }}>
            {fields.map(({ name, label, type = "text", icon }) => (
              <Grid item xs={12} sx={{ pl: 0, pr: 0, mb: 1 }} key={name}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="medium" 
                  gutterBottom
                  sx={{ mt: isMobile ? 1 : 0, pl: 0 }}
                >
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={label}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched[name] && !!errors[name]}
                  helperText={touched[name] && errors[name] ? errors[name] : " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {icon}
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      minHeight: "20px",
                      margin: "4px 0 0",
                    },
                    pl: 0
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12} sx={{ pl: 0, pr: 0, mb: 1 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="medium" 
                gutterBottom
                sx={{ mt: isMobile ? 1 : 0 }}
              >
                Latitude
              </Typography>
              <TextField
                fullWidth
                placeholder="Latitude"
                name="latitude"
                value={formData.latitude}
                disabled
                helperText=" "
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                  endAdornment: locationLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ pl: 0, pr: 0, mb: 1 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="medium" 
                gutterBottom
                sx={{ mt: isMobile ? 1 : 0 }}
              >
                Longitude
              </Typography>
              <TextField
                fullWidth
                placeholder="Longitude"
                name="longitude"
                value={formData.longitude}
                disabled
                helperText=" "
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                  endAdornment: locationLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>

            <Grid 
              item 
              xs={12} 
              display="flex" 
              justifyContent="center" 
              sx={{ mt: isMobile ? 2 : 3, mb: isMobile ? 1 : 2, pl: 0, pr: 0 }}
            >
              <Button
                type="submit"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                disabled={!formValid}
                sx={{
                  py: isMobile ? 1 : 1.5,
                  px: isMobile ? 4 : 6,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  minWidth: isMobile ? "150px" : "180px",
                  borderRadius: isMobile ? 4 : 8,
                  bgcolor: formValid ? "#4169e1" : "#e0e0e0",
                  color: formValid ? "white" : "#9e9e9e",
                  "&:hover": {
                    bgcolor: formValid ? "#3157d5" : "#e0e0e0",
                  },
                  width: isMobile ? "100%" : "auto",
                  maxWidth: "300px"
                }}
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ 
          vertical: isMobile ? "top" : "bottom", 
          horizontal: "center" 
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EmployeeForm;
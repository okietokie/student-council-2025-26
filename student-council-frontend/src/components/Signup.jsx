import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  useTheme,
  alpha,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Alert,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  IconButton
} from "@mui/material";
import { motion } from "framer-motion";
import { 
  PersonAdd, 
  ArrowForward, 
  School, 
  Person, 
  Email,
  Lock,
  Groups,
  Class as ClassIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import axiosClient from "../api/axiosClient";
import Navbar from "./Navbar";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    councilPosition: "",
    className: ""
  });
  
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch classes from API
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      // Use the correct endpoint for fetching classes
      const response = await axiosClient.get('/classes'); 
      console.log("Classes response:", response.data);
      
      // Check if response is an array or has a data property
      if (Array.isArray(response.data)) {
        setClasses(response.data);
      } else if (response.data && Array.isArray(response.data.classes)) {
        setClasses(response.data.classes);
      } else if (response.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      } else {
        // Fallback to mock data if API returns unexpected format
        console.warn("Unexpected response format for classes:", response.data);
        setClasses([
          { _id: "1", className: "BSC CS - Year 1" },
          { _id: "2", className: "BSC CS - Year 2" },
          { _id: "3", className: "BSC CS - Year 3" },
          { _id: "4", className: "LU BBA - Year 1" },
          { _id: "5", className: "LU BBA - Year 2" },
          { _id: "6", className: "LU BBA - Year 3" },
          { _id: "7", className: "Psychology" },
          { _id: "8", className: "LMU" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      // Fallback to mock data if API fails
      setClasses([
        { _id: "1", className: "BSC CS - Year 1" },
        { _id: "2", className: "BSC CS - Year 2" },
        { _id: "3", className: "BSC CS - Year 3" },
        { _id: "4", className: "LU BBA - Year 1" },
        { _id: "5", className: "LU BBA - Year 2" },
        { _id: "6", className: "LU BBA - Year 3" },
        { _id: "7", className: "Psychology" },
        { _id: "8", className: "LMU" },
      ]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const councilPositions = [
    { value: "CHAIRMAN", label: "Chairman" },
    { value: "CHAIRPERSON", label: "Chairperson" },
    { value: "CLASS_REP", label: "Class Representative" },
    { value: "SPORTS_SECRETARY", label: "Sports Secretary" },
    { value: "ARTS_SECRETARY", label: "Arts Secretary" },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
        return "";
      
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) 
          return "Must contain at least one uppercase letter and one number";
        return "";
      
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords don't match";
        return "";
      
      case "name":
        if (!value) return "Full name is required";
        if (value.length < 2) return "Minimum 2 characters";
        return "";
      
      case "className":
        if ((formData.role === "STUDENT" || formData.role === "STUDENT_COUNCIL") && !value) 
          return "Class selection is required";
        return "";
      
      case "councilPosition":
        if (formData.role === "STUDENT_COUNCIL" && !value) 
          return "Council position is required";
        return "";
      
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === "confirmPassword") return; // Skip confirmPassword in initial validation
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Special validation for confirmPassword
    const confirmPasswordError = validateField("confirmPassword", formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ 
        text: "Please fix the errors in the form", 
        type: "error" 
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        className: formData.className
      };

      if (formData.role === "STUDENT_COUNCIL" && formData.councilPosition) {
        submitData.councilPosition = formData.councilPosition;
      }else{
        submitData.councilPosition = null;
      }
      console.log("submit data:", submitData);
      const response = await axiosClient.post(`/auth/register`, submitData, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage({ 
        text: "Account created successfully! Your account is pending approval. You'll be notified when approved.", 
        type: "success" 
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT",
        councilPosition: "",
        className: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Signup error:", error);
      setMessage({ 
        text: error.response?.data?.message || error.message || "Signup failed. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
          <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.05)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 50%, 
          ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        px: 2,
        py: 4,
      }}
    >   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: 500 }}
      >
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.background.paper, 0.95)} 0%, 
              ${alpha(theme.palette.background.default, 0.98)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, 
                ${theme.palette.primary.main} 0%, 
                ${theme.palette.secondary.main} 50%, 
                ${theme.palette.primary.light} 100%)`,
              borderRadius: '4px 4px 0 0',
            }
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <PersonAdd 
                  sx={{ 
                    fontSize: '2.5rem', 
                    color: theme.palette.primary.main,
                    mr: 1 
                  }} 
                />
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  textAlign="center"
                  sx={{
                    background: `linear-gradient(135deg, 
                      ${theme.palette.primary.main} 0%, 
                      ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Adlam Display", serif',
                  }}
                >
                  Create Account
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="subtitle1"
                color={theme.palette.text.secondary}
                textAlign="center"
                sx={{ mb: 4 }}
              >
                Join the Student Council Portal
              </Typography>
            </motion.div>

            {message.text && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity={message.type} 
                  sx={{ 
                    mb: 3,
                    backgroundColor: message.type === 'success' 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${message.type === 'success' 
                      ? alpha(theme.palette.success.main, 0.2)
                      : alpha(theme.palette.error.main, 0.2)}`,
                    color: theme.palette.text.primary,
                  }}
                  onClose={() => setMessage({ text: "", type: "" })}
                >
                  {message.text}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSignup}>
              {[
                { name: "name", label: "Full Name", type: "text", icon: <Person /> },
                { name: "email", label: "Email Address", type: "email", icon: <Email /> },
                { 
                  name: "password", 
                  label: "Password", 
                  type: showPassword ? 'text' : 'password',
                  icon: <Lock />,
                  endIcon: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: theme.palette.action.active }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                },
                { 
                  name: "confirmPassword", 
                  label: "Confirm Password", 
                  type: showConfirmPassword ? 'text' : 'password',
                  icon: <Lock />,
                  endIcon: (
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: theme.palette.action.active }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                },
              ].map((field, idx) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                >
                  <TextField
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    fullWidth
                    required
                    margin="normal"
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ 
                            mr: 1.5, 
                            display: 'flex', 
                            alignItems: 'center',
                            color: theme.palette.primary.main,
                          }}>
                            {field.icon}
                          </Box>
                        </InputAdornment>
                      ),
                      endAdornment: field.endIcon,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                          backgroundColor: alpha(theme.palette.primary.main, 0.03),
                          boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        '&.Mui-focused': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                          color: theme.palette.primary.main,
                        }
                      },
                    }}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
                  <FormLabel 
                    component="legend"
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    Select Your Role
                  </FormLabel>
                  <RadioGroup
                    row
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    sx={{ 
                      gap: 2,
                      '& .MuiFormControlLabel-root': {
                        margin: 0,
                      }
                    }}
                  >
                    <FormControlLabel
                      value="STUDENT"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1
                        }}>
                          <School sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                          <Typography sx={{ fontWeight: 500 }}>
                            Student
                          </Typography>
                        </Box>
                      }
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `2px solid ${formData.role === 'STUDENT' 
                          ? theme.palette.primary.main
                          : alpha(theme.palette.divider, 0.2)}`,
                        backgroundColor: formData.role === 'STUDENT' 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    />
                    <FormControlLabel
                      value="STUDENT_COUNCIL"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1
                        }}>
                          <Groups sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                          <Typography sx={{ fontWeight: 500 }}>
                            Council Member
                          </Typography>
                        </Box>
                      }
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `2px solid ${formData.role === 'STUDENT_COUNCIL' 
                          ? theme.palette.secondary.main
                          : alpha(theme.palette.divider, 0.2)}`,
                        backgroundColor: formData.role === 'STUDENT_COUNCIL' 
                          ? alpha(theme.palette.secondary.main, 0.1)
                          : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: theme.palette.secondary.main,
                          backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                        }
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </motion.div>

              {(formData.role === "STUDENT" || formData.role === "STUDENT_COUNCIL") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormControl 
                    fullWidth 
                    margin="normal"
                    error={!!errors.className}
                    required={formData.role === "STUDENT" || formData.role === "STUDENT_COUNCIL"}
                  >
                    <InputLabel sx={{ color: theme.palette.text.secondary }}>
                      Select Class *
                    </InputLabel>
                    {loadingClasses ? (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        py: 2 
                      }}>
                        <CircularProgress size={24} />
                        <Typography sx={{ ml: 2 }}>Loading classes...</Typography>
                      </Box>
                    ) : (
                      <>
                        <Select
                          name="className"
                          value={formData.className}
                          onChange={handleChange}
                          label="Select Class *"
                          sx={{
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.background.paper, 0.6),
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.divider, 0.2),
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.primary.main, 0.5),
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>Select your class</em>
                          </MenuItem>
                          {classes.map((cls) => (
                            <MenuItem key={cls._id} value={cls.className}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ClassIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                {cls.className}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.className && (
                          <FormHelperText sx={{ color: theme.palette.error.main }}>
                            {errors.className}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  </FormControl>
                </motion.div>
              )}

              {formData.role === "STUDENT_COUNCIL" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormControl 
                    fullWidth 
                    margin="normal"
                    error={!!errors.councilPosition}
                    required
                  >
                    <InputLabel sx={{ color: theme.palette.text.secondary }}>
                      Council Position *
                    </InputLabel>
                    <Select
                      name="councilPosition"
                      value={formData.councilPosition}
                      onChange={handleChange}
                      label="Council Position *"
                      sx={{
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.divider, 0.2),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a position</em>
                      </MenuItem>
                      {councilPositions.map((position) => (
                        <MenuItem key={position.value} value={position.value}>
                          {position.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.councilPosition && (
                      <FormHelperText sx={{ color: theme.palette.error.main }}>
                        {errors.councilPosition}
                      </FormHelperText>
                    )}
                  </FormControl>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  endIcon={!loading && <ArrowForward />}
                  disabled={loading || loadingClasses || classes.length === 0}
                  sx={{
                    mt: 4,
                    py: 1.8,
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    fontSize: '1.1rem',
                    background: `linear-gradient(135deg, 
                      ${theme.palette.primary.main} 0%, 
                      ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
                      background: `linear-gradient(135deg, 
                        ${theme.palette.primary.dark} 0%, 
                        ${theme.palette.secondary.dark} 100%)`,
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.action.disabled, 0.5),
                      color: theme.palette.text.disabled,
                      transform: 'none',
                      boxShadow: 'none',
                    },
                    fontFamily: '"Adlam Display", serif',
                  }}
                >
                  {loading ? (
                    <CircularProgress 
                      size={24} 
                      sx={{ color: theme.palette.primary.contrastText }} 
                    />
                  ) : (
                    classes.length === 0 ? "No Classes Available" : "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardActions
            sx={{
              flexDirection: "column",
              alignItems: "center",
              mt: 1,
              gap: 1,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    textDecoration: "none",
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textShadow = `0 0 8px ${alpha(theme.palette.primary.main, 0.5)}`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textShadow = 'none';
                  }}
                >
                  Login here <ArrowForward sx={{ fontSize: '1rem', verticalAlign: 'middle' }} />
                </Link>
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <Typography variant="caption" color={theme.palette.text.secondary}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </motion.div>
          </CardActions>
        </Card>
      </motion.div>
    </Box>
    </>
  );
}
"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/auth";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";

interface LoginResult {
  success: boolean;
  user: User | null;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError(null);
    const result = await login(values.email, values.password) as LoginResult;
    setSubmitting(false);
    if (result.success && result.user) {
      switch (result.user.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "office":
          router.push("/dashboard/office");
          break;
        case "client":
          router.push("/dashboard/client");
          break;
        case "user":
          router.push("/dashboard/user");
          break;
        default:
          router.push("/");
      }
    } else {
      setError(result.error || "Credenciales inválidas. Verifica tu email y contraseña.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: '100vw',
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "stretch",
        justifyContent: "center",
        background: "linear-gradient(120deg, #1976d2 0%, #43a047 100%)",
      }}
    >
      {/* Columna Izquierda */}
      <Box
        sx={{
          flex: { xs: 'unset', md: '0 0 60%' },
          width: { xs: '100%', md: '50vw' },
          minHeight: '100vh',
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(120deg, #1976d2 0%, #43a047 100%)",
          color: "#fff",
          p: 0,
        }}
      >
        <Image src="/images/logochaqui.jpg" alt="Logo ChasquiBus" width={200} height={200} style={{ borderRadius: 15, objectFit: 'cover', boxShadow: '0 2px 24px #0003', marginBottom: 32 }} />
        <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: 1, fontFamily: 'Segoe UI, Arial, sans-serif' }}>
          ¡Bienvenido a ChasquiBus!
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 400, opacity: 0.95, fontFamily: 'Segoe UI, Arial, sans-serif' }}>
          Gestiona tus viajes, compra boletos y administra rutas de manera fácil y rápida.<br />
          ¡Viaja seguro y cómodo por todo Ecuador!
        </Typography>
      </Box>
      {/* Columna Derecha (Formulario) */}
        <Box
          sx={{
          flex: { xs: 'unset', md: '0 0 50%' },
          width: { xs: '100%', md: '50vw' },
          minHeight: '100vh',
          minWidth: { xs: '100%', md: 420 },
          maxWidth: 700,
          background: { xs: 'rgba(255,255,255,0.95)', md: '#fff' },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          justifyContent: "center",
          p: 0,
          boxShadow: { xs: 0, md: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" fontWeight={700} sx={{ mb: 2, color: '#1976d2' }}>
            Iniciar sesión
          </Typography>
          {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Correo electrónico inválido")
                .required("Campo requerido"),
              password: Yup.string().required("Campo requerido"),
            })}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form style={{ width: "100%", marginTop: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  placeholder="Ingresa tu correo electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ background: "#f8fafc", borderRadius: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ background: "#f8fafc", borderRadius: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon sx={{ color: '#1976d2', mr: 1 }} />
                      </InputAdornment>
                    )
                  }}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Recordarme"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: "1rem", borderRadius: 2, boxShadow: 3 }}
                  disabled={isSubmitting}
                >
                  Iniciar sesión
                </Button>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, gap: 2 }}>
                  {/* Enlaces eliminados según solicitud */}
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}
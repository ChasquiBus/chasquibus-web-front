"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/auth";

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
        background: "linear-gradient(120deg, #1976d2 0%, #43a047 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          p: { xs: 2, sm: 4 },
          background: "rgba(255,255,255,0.95)",
          width: { xs: "100%", sm: 420 },
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight={700} sx={{ mb: 2 }}>
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
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ background: "#f8fafc", borderRadius: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ background: "#f8fafc", borderRadius: 2 }}
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
                  <Link href="#" style={{ fontSize: "0.95rem", color: "#1976d2", textDecoration: "none" }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                  <Link href="/auth/register" style={{ fontSize: "0.95rem", color: "#1976d2", textDecoration: "none" }}>
                    ¿No tienes cuenta? Regístrate
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}
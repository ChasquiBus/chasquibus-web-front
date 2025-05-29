"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, Alert, Snackbar, CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { adminCooperativasService } from "@/services/adminCooperativas";
import { cooperativesService } from "@/services/cooperatives";
import { AdminCooperativa, CreateAdminCooperativaDto } from "@/types/adminCooperativa";
import { Cooperativa } from "@/types/cooperatives";
import AdminCooperativasTable from "@/components/adminCooperativas/AdminCooperativasTable";
import AdminCooperativaForm from "@/components/adminCooperativas/AdminCooperativaForm";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminCooperativa[]>([]);
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Partial<CreateAdminCooperativaDto> | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [adminsData, cooperativasData] = await Promise.all([
        adminCooperativasService.getAll(),
        cooperativesService.getAll(),
      ]);
      setAdmins(adminsData);
      setCooperativas(cooperativasData);
      setError(null);
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (values: CreateAdminCooperativaDto) => {
    try {
      await adminCooperativasService.create(values);
      setSnackbar({ open: true, message: "Administrador creado exitosamente", severity: "success" });
      loadData();
    } catch {
      setSnackbar({ open: true, message: "Error al crear el administrador", severity: "error" });
    }
  };

  const handleEdit = async (values: Partial<CreateAdminCooperativaDto>) => {
    if (editId === null) return;
    try {
      await adminCooperativasService.update(editId, values);
      setSnackbar({ open: true, message: "Administrador actualizado exitosamente", severity: "success" });
      loadData();
    } catch {
      setSnackbar({ open: true, message: "Error al actualizar el administrador", severity: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este administrador?")) return;
    try {
      await adminCooperativasService.delete(id);
      setSnackbar({ open: true, message: "Administrador eliminado exitosamente", severity: "success" });
      loadData();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar el administrador", severity: "error" });
    }
  };

  const handleOpenForm = (admin?: AdminCooperativa) => {
    if (admin) {
      setSelectedAdmin({
        cooperativaTransporteId: admin.cooperativaTransporteId,
        email: admin.usuario.email,
        nombre: admin.usuario.nombre,
        apellido: admin.usuario.apellido,
        cedula: admin.usuario.cedula,
        telefono: admin.usuario.telefono,
        activo: admin.usuario.activo,
      });
      setEditId(admin.usuario.id);
    } else {
      setSelectedAdmin(null);
      setEditId(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedAdmin(null);
    setEditId(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Gestión de Administradores de Cooperativas
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Nuevo Administrador
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AdminCooperativasTable admins={admins} onEdit={handleOpenForm} onDelete={handleDelete} />
      )}
      <AdminCooperativaForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={editId ? handleEdit : handleCreate}
        initialValues={selectedAdmin || undefined}
        title={editId ? "Editar Administrador" : "Nuevo Administrador"}
        cooperativas={cooperativas}
        isEdit={!!editId}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
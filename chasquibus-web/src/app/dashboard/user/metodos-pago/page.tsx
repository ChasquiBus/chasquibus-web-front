"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MetodoPagoForm from "@/components/metodosPago/MetodoPagoForm";
import MetodosPagoTable from "@/components/metodosPago/MetodosPagoTable";
import * as metodosPagoService from "@/services/metodosPago";
import { useAuth } from "@/hooks/useAuth";

export default function MetodosPagoPage() {
  const { auth } = useAuth();
  const cooperativaId = auth?.user?.cooperativaTransporte?.id;

  const [metodosPago, setMetodosPago] = useState<metodosPagoService.MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<metodosPagoService.MetodoPago | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchMetodosPago = async () => {
    setLoading(true);
    try {
      const data = await metodosPagoService.getAllMetodosPago();
      setMetodosPago(data.filter(mp => mp.cooperativaId === cooperativaId));
    } catch (e) {
      setMetodosPago([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (cooperativaId) fetchMetodosPago();
  }, [cooperativaId]);

  const handleCreate = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (metodo: metodosPagoService.MetodoPago) => {
    setEditData(metodo);
    setOpenForm(true);
  };

  const handleSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editData) {
        await metodosPagoService.updateMetodoPago(editData.id, data);
      } else {
        await metodosPagoService.createMetodoPago(data);
      }
      setOpenForm(false);
      fetchMetodosPago();
    } catch (e) {
      // Manejar error
    }
    setFormLoading(false);
  };

  const handleToggleActivo = async (id: number, activo: boolean) => {
    await metodosPagoService.toggleActiveMetodoPago(id);
    fetchMetodosPago();
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'black' }}>Métodos de Pago</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Método de Pago
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MetodosPagoTable
          metodosPago={metodosPago}
          onEdit={handleEdit}
          onToggleActivo={handleToggleActivo}
        />
      )}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <MetodoPagoForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
          initialValues={editData || {}}
          cooperativaId={cooperativaId ?? 0}
          isEdit={!!editData}
          loading={formLoading}
        />
      </Dialog>
    </Box>
  );
} 
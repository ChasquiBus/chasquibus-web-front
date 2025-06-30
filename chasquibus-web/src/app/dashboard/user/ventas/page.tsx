"use client";
import React, { useState } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VentaPresencialModal from "@/components/ventas/VentaPresencialModal";

export default function VentasPage() {
  const [openVenta, setOpenVenta] = useState(false);

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'black' }}>Ventas Presenciales</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenVenta(true)}>
          Nueva venta presencial
        </Button>
      </Box>
      {/* Aquí podría ir una tabla de ventas recientes */}
      <Dialog open={openVenta} onClose={() => setOpenVenta(false)} maxWidth="lg" fullWidth>
        <VentaPresencialModal open={openVenta} onClose={() => setOpenVenta(false)} />
      </Dialog>
    </Box>
  );
} 
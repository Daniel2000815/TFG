import React, { useState, useEffect } from "react";
import MaterialCard from "./MaterialCard";
import Grid from '@mui/material/Grid';

export default function MaterialsPage() {
  return <Grid
    container
    direction="row"
    justifyContent="flex-start"
    alignItems="flex-start"
    spacing={2}
    >

    <Grid item><MaterialCard/></Grid>
    <Grid item><MaterialCard/></Grid>
    <Grid item><MaterialCard/></Grid>
    <Grid item><MaterialCard/></Grid>
    <Grid item><MaterialCard/></Grid>
    <Grid item><MaterialCard/></Grid>
    <Grid item><MaterialCard/></Grid>
</Grid>;
}

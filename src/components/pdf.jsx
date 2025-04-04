"use client"

import React, { useRef, useEffect, useState } from "react"
import { PDFExport } from "@progress/kendo-react-pdf"
import {
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Paper,
} from "@mui/material"
import { handleExportWithComponent } from "../../.lh/src/utils"

// Function to convert image URL to Base64
const toBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const proxyUrl = "https://corsproxy.io/?url="
        const imgUrl = proxyUrl + encodeURIComponent(url)

        const img = new Image()
        img.crossOrigin = "Anonymous"
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL())
        }
        img.onerror = reject
        img.src = imgUrl
    })
}

const PatientPDF = ({ form, ref }) => {

    const [imagesBase64, setImagesBase64] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchImagesAsBase64 = async () => {
            try {
                setIsLoading(true)
                const imageUrls = {
                    batch: form?.batch_images || [],
                    before: form?.before_images || [],
                    after: form?.after_images || [],
                    patientSign: form?.treatment_plan?.patient_sign ? [form.treatment_plan.patient_sign] : [],
                    furtherTreatment: form?.further_treatment?.map((treatment) => treatment?.sign) || [],
                    patientConsent: form?.patient_consent?.sign ? [form.patient_consent.sign] : [],
                }

                // Convert each image URL to Base64
                const imagePromises = Object.keys(imageUrls).map(async (key) => {
                    const urls = imageUrls[key]
                    const base64Images = await Promise.all(urls.map((url) => toBase64(url)))
                    return { [key]: base64Images }
                })

                // Set all images as Base64 in the state
                const base64Data = await Promise.all(imagePromises)
                const allImages = base64Data.reduce((acc, curr) => ({ ...acc, ...curr }), {})
                setImagesBase64(allImages)
                setIsLoading(false)

                // Auto-download PDF once images are loaded
                setTimeout(() => {
                    if (pdfExportComponent.current) {
                        pdfExportComponent.current.save()
                    }
                }, 500)
            } catch (error) {
                console.error("Error converting images to base64:", error)
                setIsLoading(false)
            }
        }

        fetchImagesAsBase64()
        if (form) {
            handleExportWithComponent(ref)
        }
       
    }, [form])

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }


    return (
        <div style={{ position: "fixed", left: "-9999px" }}>
            {isLoading ? (
                <Button variant="contained" color="primary" disabled>
                    Preparing PDF...
                </Button>
            ) : (
                <Button variant="contained" color="primary" >
                    Download Patient Report
                </Button>
            )}

            <PDFExport
                ref={ref}
                paperSize="A4"
                margin="10px"
                fileName={`Patient_Report_${form?.first_name || ""}_${form?.last_name || ""}`}
            >
                <Card
                    sx={{
                        maxWidth: "800px",
                        margin: "auto",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                >
                    <CardContent sx={{ padding: "30px" }}>
                        {/* Header */}
                        <Box
                            sx={{
                                textAlign: "center",
                                marginBottom: "20px",
                                backgroundColor: "#f8f9fa",
                                padding: "20px",
                                borderRadius: "8px",
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: "700",
                                    color: "#2c3e50",
                                    marginBottom: "5px",
                                }}
                            >
                                Patient Medical Report
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: "#5d6778" }}>
                                Confidential Medical Documentation
                            </Typography>
                        </Box>

                        {/* Patient Information Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                padding: "20px",
                                marginBottom: "25px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "600",
                                    marginBottom: "15px",
                                    color: "#2c3e50",
                                    borderBottom: "2px solid #3498db",
                                    paddingBottom: "8px",
                                    display: "inline-block",
                                }}
                            >
                                Patient Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Name:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {form?.first_name} {form?.last_name}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        DOB: <span style={{ fontWeight: "400", color: "#2c3e50" }}>{formatDate(form?.dob)}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Phone: <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.phone}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Email: <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.email}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Address:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {form?.address}, {form?.post_code}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Notes: <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.notes || "None"}</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Next of Kin Information */}
                        <Paper
                            elevation={0}
                            sx={{
                                padding: "20px",
                                marginBottom: "25px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "600",
                                    marginBottom: "15px",
                                    color: "#2c3e50",
                                    borderBottom: "2px solid #3498db",
                                    paddingBottom: "8px",
                                    display: "inline-block",
                                }}
                            >
                                Next of Kin
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Name:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.kin_details?.name || "N/A"}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Phone:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.kin_details?.phone || "N/A"}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Address:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.kin_details?.address || "N/A"}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Email:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>{form?.kin_details?.email || "N/A"}</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* General Practitioners */}
                        <Paper
                            elevation={0}
                            sx={{
                                padding: "20px",
                                marginBottom: "25px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "600",
                                    marginBottom: "15px",
                                    color: "#2c3e50",
                                    borderBottom: "2px solid #3498db",
                                    paddingBottom: "8px",
                                    display: "inline-block",
                                }}
                            >
                                General Practitioners
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Name:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {form?.general_practitioner?.name || "N/A"}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Phone:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {form?.general_practitioner?.phone || "N/A"}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Address:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {form?.general_practitioner?.address || "N/A"}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Email:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {form?.general_practitioner?.email || "N/A"}
                                        </span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Treatment Plan */}
                        <Paper
                            elevation={0}
                            className="kendoPaper2"
                            sx={{
                                padding: "20px",
                                marginBottom: "25px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "600",
                                    marginBottom: "15px",
                                    color: "#2c3e50",
                                    borderBottom: "2px solid #3498db",
                                    paddingBottom: "8px",
                                    display: "inline-block",
                                }}
                            >
                                Treatment Plan
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e", marginBottom: "8px" }}>
                                        Patient Concerns:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        {form?.treatment_plan?.patient_concerns || "None specified"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e", marginBottom: "8px" }}>
                                        Patient Goals:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        {form?.treatment_plan?.patient_goals || "None specified"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e", marginBottom: "8px" }}>
                                        Advised Plan:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        {form?.treatment_plan?.advised_plan || "None specified"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e", marginBottom: "8px" }}>
                                        Expected Result:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        {form?.treatment_plan?.expected_result || "None specified"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e" }}>
                                        Date:{" "}
                                        <span style={{ fontWeight: "400", color: "#2c3e50" }}>
                                            {formatDate(form?.treatment_plan?.date)}
                                        </span>
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: "500", color: "#34495e", marginBottom: "8px" }}>
                                        Patient Signature:
                                    </Typography>
                                    {imagesBase64?.patientConsent?.[0] && (
                                        <Box
                                            sx={{
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "6px",
                                                padding: "10px",
                                                backgroundColor: "#ffffff",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <img
                                                src={imagesBase64?.patientConsent?.[0] || "/placeholder.svg"}
                                                alt="Treatment Plan Sign"
                                                style={{
                                                    width: "200px",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Images Section */}
                        <Paper
                            elevation={0}
                            className="kendoPaper"
                            sx={{
                                padding: "20px",
                                marginBottom: "25px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "600",
                                    marginBottom: "15px",
                                    color: "#2c3e50",
                                    borderBottom: "2px solid #3498db",
                                    paddingBottom: "8px",
                                    display: "inline-block",
                                    marginTop: "25px",
                                }}
                            >
                                Medical Images
                            </Typography>

                            {/* Batch Images */}
                            <Box sx={{ marginBottom: "20px" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "500", marginBottom: "10px", color: "#34495e" }}>
                                    Batch Images:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: "15px",
                                        flexWrap: "wrap",
                                        padding: "15px",
                                        borderRadius: "6px",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    {imagesBase64?.batch?.length > 0 ? (
                                        imagesBase64.batch.map((img, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "6px",
                                                    padding: "5px",
                                                    backgroundColor: "#ffffff",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                                }}
                                            >
                                                <img
                                                    src={img || "/placeholder.svg"}
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>No batch images available</Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* Before Images */}
                            <Box sx={{ marginBottom: "20px" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "500", marginBottom: "10px", color: "#34495e" }}>
                                    Before Treatment:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: "15px",
                                        flexWrap: "wrap",
                                        padding: "15px",
                                        borderRadius: "6px",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    {imagesBase64?.before?.length > 0 ? (
                                        imagesBase64.before.map((img, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "6px",
                                                    padding: "5px",
                                                    backgroundColor: "#ffffff",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                                }}
                                            >
                                                <img
                                                    src={img || "/placeholder.svg"}
                                                    alt={`Before ${index + 1}`}
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>No before images available</Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* After Images */}
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: "500", marginBottom: "10px", color: "#34495e" }}>
                                    After Treatment:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: "15px",
                                        flexWrap: "wrap",
                                        padding: "15px",
                                        borderRadius: "6px",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    {imagesBase64?.after?.length > 0 ? (
                                        imagesBase64.after.map((img, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "6px",
                                                    padding: "5px",
                                                    backgroundColor: "#ffffff",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                                }}
                                            >
                                                <img
                                                    src={img || "/placeholder.svg"}
                                                    alt={`After ${index + 1}`}
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>No after images available</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Paper>

                        {/* Treatment Records Table - Page Break */}
                        <Box sx={{ pageBreakBefore: "always" }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: "20px",
                                    marginBottom: "25px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "600",
                                        marginBottom: "15px",
                                        color: "#2c3e50",
                                        borderBottom: "2px solid #3498db",
                                        paddingBottom: "8px",
                                        display: "inline-block",
                                    }}
                                >
                                    Treatment Records
                                </Typography>

                                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#f1f8ff" }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: "600", color: "#2c3e50" }}>Date</TableCell>
                                                <TableCell sx={{ fontWeight: "600", color: "#2c3e50" }}>Description</TableCell>
                                                <TableCell sx={{ fontWeight: "600", color: "#2c3e50" }}>Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {form?.treatment_record?.length > 0 ? (
                                                form.treatment_record.map((record, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                                        }}
                                                    >
                                                        <TableCell>{formatDate(record.date)}</TableCell>
                                                        <TableCell>{record.description}</TableCell>
                                                        <TableCell>${record.amount}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{ textAlign: "center", color: "#7f8c8d", fontStyle: "italic" }}>
                                                        No treatment records available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                            {/* Further Treatment Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: "20px",
                                    marginBottom: "25px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "600",
                                        marginBottom: "15px",
                                        color: "#2c3e50",
                                        borderBottom: "2px solid #3498db",
                                        paddingBottom: "8px",
                                        display: "inline-block",
                                    }}
                                >
                                    Further Treatment
                                </Typography>

                                <Grid container spacing={3}>
                                    {imagesBase64?.furtherTreatment?.map((treatment, index) => (
                                        <React.Fragment key={`treatment-${index}`}>
                                            {/* Date Grid Item */}
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Box
                                                    sx={{
                                                        padding: "15px",
                                                        borderRadius: "6px",
                                                    }}
                                                >
                                                    <Typography variant="body1" sx={{ fontWeight: "500", color: "#34495e" }}>
                                                        Date:
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#2c3e50", marginTop: "5px" }}>
                                                        {form?.further_treatment?.[index]?.date
                                                            ? formatDate(form.further_treatment[index].date)
                                                            : "No Date Available"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* Signature Grid Item */}
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Box
                                                    sx={{
                                                        padding: "15px",
                                                        borderRadius: "6px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: "500", color: "#34495e", marginBottom: "10px" }}
                                                    >
                                                        Patient Signature:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            border: "1px solid #e0e0e0",
                                                            borderRadius: "6px",
                                                            padding: "10px",
                                                            backgroundColor: "#ffffff",
                                                        }}
                                                    >
                                                        <img
                                                            src={treatment || "/placeholder.svg"}
                                                            alt="Further Treatment Sign"
                                                            style={{
                                                                width: "200px",
                                                                borderRadius: "6px",
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </React.Fragment>
                                    ))}

                                    {(!imagesBase64?.furtherTreatment || imagesBase64.furtherTreatment.length === 0) && (
                                        <Grid item xs={12}>
                                            <Typography sx={{ color: "#7f8c8d", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
                                                No further treatment information available
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>

                            {/* Patient Consent */}
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: "20px",
                                    marginBottom: "25px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "600",
                                        marginBottom: "15px",
                                        color: "#2c3e50",
                                        borderBottom: "2px solid #3498db",
                                        paddingBottom: "8px",
                                        display: "inline-block",
                                    }}
                                >
                                    Patient Consent
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Box
                                            sx={{
                                                padding: "15px",
                                                borderRadius: "6px",
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: "500", color: "#34495e", marginBottom: "10px" }}>
                                                Consent Details:
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#2c3e50" }}>
                                                {form?.patient_consent?.details || "No Patient Consent Details Available"}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={6}>
                                        <Box
                                            sx={{
                                                padding: "15px",
                                                borderRadius: "6px",
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: "500", color: "#34495e", marginBottom: "10px" }}>
                                                Patient Signature:
                                            </Typography>
                                            {imagesBase64?.patientConsent?.[0] ? (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        border: "1px solid #e0e0e0",
                                                        borderRadius: "6px",
                                                        padding: "10px",
                                                        backgroundColor: "#ffffff",
                                                    }}
                                                >
                                                    <img
                                                        src={imagesBase64.patientConsent[0] || "/placeholder.svg"}
                                                        alt="Patient Consent Signature"
                                                        style={{
                                                            width: "200px",
                                                            borderRadius: "6px",
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Typography
                                                    sx={{ color: "#7f8c8d", fontStyle: "italic", textAlign: "center", padding: "20px" }}
                                                >
                                                    No signature available
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Side Effects */}
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: "20px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "600",
                                        marginBottom: "15px",
                                        color: "#2c3e50",
                                        borderBottom: "2px solid #3498db",
                                        paddingBottom: "8px",
                                        display: "inline-block",
                                    }}
                                >
                                    Patient Side Effects
                                </Typography>

                                <Box
                                    sx={{
                                        padding: "15px",
                                        borderRadius: "6px",
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: "#2c3e50" }}>
                                        {form?.side_effect?.details || "No Side Effects Reported"}
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* Footer */}
                            <Box
                                sx={{
                                    marginTop: "30px",
                                    textAlign: "center",
                                    padding: "15px",
                                    borderTop: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                                    This document is confidential and contains private medical information.
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#7f8c8d", marginTop: "5px" }}>
                                    Generated on: {new Date().toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </PDFExport>
        </div>
    )
}

export default PatientPDF


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { isAutheticated } from "src/auth";

const initialGlobalSeo = {
  websiteMetaTitle: "",
  websiteMetaDescription: "",
  websiteMetaKeywords: "",
  googleAnalyticsId: "",
  googleSearchConsoleCode: "",
  facebookPixelId: "",
  defaultOgImage: "",
  canonicalUrl: "",
  robots: "index",
};

const initialEntitySeo = {
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
  robots: "index",
};

const getSeoValue = (obj, keys) => {
  for (const key of keys) {
    if (obj?.[key]) return obj[key];
  }
  return "";
};

const mapEntitySeo = (item) => ({
  metaTitle: getSeoValue(item, ["metaTitle", "meta_title", "seoTitle"]),
  metaDescription: getSeoValue(item, [
    "metaDescription",
    "meta_description",
    "seoDescription",
  ]),
  metaKeywords: getSeoValue(item, ["metaKeywords", "meta_keywords"]),
  ogTitle: getSeoValue(item, ["ogTitle", "og_title"]),
  ogDescription: getSeoValue(item, ["ogDescription", "og_description"]),
  ogImage: getSeoValue(item, ["ogImage", "og_image"]),
  canonicalUrl: getSeoValue(item, ["canonicalUrl", "canonical_url"]),
  robots: getSeoValue(item, ["robots"]) || "index",
});

const AddSeoRequest = () => {
  const token = isAutheticated();
  const [activeTab, setActiveTab] = useState("global");

  const [globalSeo, setGlobalSeo] = useState(initialGlobalSeo);
  const [defaultOgImageFile, setDefaultOgImageFile] = useState(null);
  const [categoryOgImageFile, setCategoryOgImageFile] = useState(null);
  const [subcategoryOgImageFile, setSubcategoryOgImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const [categorySeo, setCategorySeo] = useState(initialEntitySeo);
  const [subcategorySeo, setSubcategorySeo] = useState(initialEntitySeo);

  const [loading, setLoading] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingSubcategory, setSavingSubcategory] = useState(false);

  const fetchGlobalSeo = async () => {
    try {
      const res = await axios.get("/api/seo/view");
      const seo = res?.data?.seorequest || {};
      setGlobalSeo({
        websiteMetaTitle: getSeoValue(seo, [
          "websiteMetaTitle",
          "WebsiteMetaTitle",
          "DefaultMetaTitle",
        ]),
        websiteMetaDescription: getSeoValue(seo, [
          "websiteMetaDescription",
          "WebsiteMetaDescription",
          "DefaultMetaDescription",
        ]),
        websiteMetaKeywords: getSeoValue(seo, [
          "websiteMetaKeywords",
          "WebsiteMetaKeywords",
          "DefaultMetaKeywords",
        ]),
        googleAnalyticsId: getSeoValue(seo, [
          "googleAnalyticsId",
          "GoogleAnalytics",
        ]),
        googleSearchConsoleCode: getSeoValue(seo, [
          "googleSearchConsoleCode",
          "GoogleSearchConsoleCode",
        ]),
        facebookPixelId: getSeoValue(seo, ["facebookPixelId", "FacebookPixel"]),
        defaultOgImage: getSeoValue(seo, ["defaultOgImage", "DefaultOgImage"]),
        canonicalUrl: getSeoValue(seo, ["canonicalUrl", "CanonicalUrl"]),
        robots: getSeoValue(seo, ["robots"]) || "index",
      });
    } catch (error) {
      toast.error("Unable to load Global SEO.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/product/category/getAll/", {
        params: { page: 1, limit: 500 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res?.data?.result || []);
    } catch (error) {
      toast.error("Unable to load categories.");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get("/api/product/category/get/subcategory", {
        params: { page: 1, limit: 1000 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubcategories(res?.data?.category || []);
    } catch (error) {
      toast.error("Unable to load subcategories.");
    }
  };

  const loadInitial = async () => {
    setLoading(true);
    await Promise.all([fetchGlobalSeo(), fetchCategories(), fetchSubcategories()]);
    setLoading(false);
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return subcategories;
    return subcategories.filter(
      (item) => item?.categoryId?._id === selectedCategoryId,
    );
  }, [subcategories, selectedCategoryId]);

  const loadCategorySeo = async (categoryId) => {
    if (!categoryId) {
      setCategorySeo(initialEntitySeo);
      setCategoryOgImageFile(null);
      return;
    }
    try {
      setSavingCategory(true);
      const res = await axios.get(`/api/seo/entity/view/category/${categoryId}`);
      const payload = res?.data?.seorequest || null;
      setCategorySeo(mapEntitySeo(payload || {}));
    } catch (error) {
      toast.error("Unable to load category SEO.");
    } finally {
      setSavingCategory(false);
    }
  };

  const loadSubcategorySeo = async (subcategoryId) => {
    if (!subcategoryId) {
      setSubcategorySeo(initialEntitySeo);
      setSubcategoryOgImageFile(null);
      return;
    }
    try {
      setSavingSubcategory(true);
      const res = await axios.get(
        `/api/seo/entity/view/subcategory/${subcategoryId}`,
      );
      const payload = res?.data?.seorequest || null;
      setSubcategorySeo(mapEntitySeo(payload || {}));
    } catch (error) {
      toast.error("Unable to load subcategory SEO.");
    } finally {
      setSavingSubcategory(false);
    }
  };

  const handleGlobalSeoSave = async () => {
    try {
      setSavingGlobal(true);
      const formData = new FormData();
      formData.append("WebsiteMetaTitle", globalSeo.websiteMetaTitle || "");
      formData.append(
        "WebsiteMetaDescription",
        globalSeo.websiteMetaDescription || "",
      );
      formData.append(
        "WebsiteMetaKeywords",
        globalSeo.websiteMetaKeywords || "",
      );
      formData.append("GoogleAnalytics", globalSeo.googleAnalyticsId || "");
      formData.append(
        "GoogleSearchConsoleCode",
        globalSeo.googleSearchConsoleCode || "",
      );
      formData.append("FacebookPixel", globalSeo.facebookPixelId || "");
      formData.append("canonicalUrl", globalSeo.canonicalUrl || "");
      formData.append("robots", globalSeo.robots || "index");
      if (defaultOgImageFile) {
        formData.append("defaultOgImage", defaultOgImageFile);
      }

      await axios.post(
        "/api/seo/new",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setDefaultOgImageFile(null);
      await fetchGlobalSeo();
      toast.success("Global SEO updated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save Global SEO.");
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleCategorySeoSave = async () => {
    if (!selectedCategoryId) {
      toast.error("Select a category first.");
      return;
    }
    try {
      setSavingCategory(true);
      const formData = new FormData();
      formData.append("metaTitle", categorySeo.metaTitle);
      formData.append("metaDescription", categorySeo.metaDescription);
      formData.append("metaKeywords", categorySeo.metaKeywords);
      formData.append("ogTitle", categorySeo.ogTitle);
      formData.append("ogDescription", categorySeo.ogDescription);
      formData.append("canonicalUrl", categorySeo.canonicalUrl);
      formData.append("robots", categorySeo.robots || "index");
      if (categoryOgImageFile) {
        formData.append("ogImage", categoryOgImageFile);
      }

      await axios.post(
        `/api/seo/entity/upsert/category/${selectedCategoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setCategoryOgImageFile(null);
      await loadCategorySeo(selectedCategoryId);
      toast.success("Category SEO updated.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save category SEO.",
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const handleSubcategorySeoSave = async () => {
    if (!selectedSubcategoryId) {
      toast.error("Select a subcategory first.");
      return;
    }
    try {
      setSavingSubcategory(true);
      const formData = new FormData();
      formData.append("metaTitle", subcategorySeo.metaTitle);
      formData.append("metaDescription", subcategorySeo.metaDescription);
      formData.append("metaKeywords", subcategorySeo.metaKeywords);
      formData.append("ogTitle", subcategorySeo.ogTitle);
      formData.append("ogDescription", subcategorySeo.ogDescription);
      formData.append("canonicalUrl", subcategorySeo.canonicalUrl);
      formData.append("robots", subcategorySeo.robots || "index");
      if (subcategoryOgImageFile) {
        formData.append("ogImage", subcategoryOgImageFile);
      }

      await axios.post(
        `/api/seo/entity/upsert/subcategory/${selectedSubcategoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setSubcategoryOgImageFile(null);
      await loadSubcategorySeo(selectedSubcategoryId);
      toast.success("Subcategory SEO updated.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save subcategory SEO.",
      );
    } finally {
      setSavingSubcategory(false);
    }
  };

  const renderSeoFields = (
    value,
    setter,
    ogImageFile,
    setOgImageFile,
    robotsKey,
  ) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Meta Title"
          value={value.metaTitle}
          onChange={(e) => setter((prev) => ({ ...prev, metaTitle: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Meta Description"
          value={value.metaDescription}
          onChange={(e) =>
            setter((prev) => ({ ...prev, metaDescription: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Meta Keywords (comma separated)"
          value={value.metaKeywords}
          onChange={(e) =>
            setter((prev) => ({ ...prev, metaKeywords: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="OG Title"
          value={value.ogTitle}
          onChange={(e) => setter((prev) => ({ ...prev, ogTitle: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="OG Description"
          value={value.ogDescription}
          onChange={(e) =>
            setter((prev) => ({ ...prev, ogDescription: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" component="label" fullWidth>
          Upload OG Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setOgImageFile(file);
            }}
          />
        </Button>
        {ogImageFile ? (
          <Typography sx={{ mt: 1 }} variant="body2">
            Selected: {ogImageFile.name}
          </Typography>
        ) : null}
        {value.ogImage ? (
          <Box sx={{ mt: 1 }}>
            <img
              src={value.ogImage}
              alt="Current og"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Box>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Canonical URL"
          value={value.canonicalUrl}
          onChange={(e) =>
            setter((prev) => ({ ...prev, canonicalUrl: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={`${robotsKey}-robots-select`}>Robots</InputLabel>
          <Select
            labelId={`${robotsKey}-robots-select`}
            value={value.robots || "index"}
            label="Robots"
            onChange={(e) =>
              setter((prev) => ({ ...prev, robots: e.target.value }))
            }
          >
            <MenuItem value="index">index</MenuItem>
            <MenuItem value="noindex">noindex</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        SEO Settings
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant={activeTab === "global" ? "contained" : "outlined"}
          onClick={() => setActiveTab("global")}
        >
          Global SEO
        </Button>
        <Button
          variant={activeTab === "category" ? "contained" : "outlined"}
          onClick={() => setActiveTab("category")}
        >
          Category SEO
        </Button>
        <Button
          variant={activeTab === "subcategory" ? "contained" : "outlined"}
          onClick={() => setActiveTab("subcategory")}
        >
          Subcategory SEO
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ maxWidth: 900 }}>
          {activeTab === "global" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website Meta Title"
                  value={globalSeo.websiteMetaTitle}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      websiteMetaTitle: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Website Meta Description"
                  value={globalSeo.websiteMetaDescription}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      websiteMetaDescription: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website Meta Keywords"
                  value={globalSeo.websiteMetaKeywords}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      websiteMetaKeywords: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Google Analytics ID"
                  value={globalSeo.googleAnalyticsId}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      googleAnalyticsId: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Google Search Console Code"
                  value={globalSeo.googleSearchConsoleCode}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      googleSearchConsoleCode: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Facebook Pixel ID"
                  value={globalSeo.facebookPixelId}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      facebookPixelId: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Default OG Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setDefaultOgImageFile(file);
                    }}
                  />
                </Button>
                {defaultOgImageFile ? (
                  <Typography sx={{ mt: 1 }} variant="body2">
                    Selected: {defaultOgImageFile.name}
                  </Typography>
                ) : null}
                {globalSeo.defaultOgImage ? (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={globalSeo.defaultOgImage}
                      alt="Current default og"
                      style={{
                        width: "100%",
                        maxHeight: 180,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Canonical URL"
                  value={globalSeo.canonicalUrl}
                  onChange={(e) =>
                    setGlobalSeo((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="global-robots-select">Robots</InputLabel>
                  <Select
                    labelId="global-robots-select"
                    value={globalSeo.robots || "index"}
                    label="Robots"
                    onChange={(e) =>
                      setGlobalSeo((prev) => ({
                        ...prev,
                        robots: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="index">index</MenuItem>
                    <MenuItem value="noindex">noindex</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleGlobalSeoSave}
                  disabled={savingGlobal}
                >
                  {savingGlobal ? <CircularProgress size={22} /> : "Save Global SEO"}
                </Button>
              </Grid>
            </Grid>
          )}

          {activeTab === "category" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="category-seo-select">Select Category</InputLabel>
                  <Select
                    labelId="category-seo-select"
                    value={selectedCategoryId}
                    label="Select Category"
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedCategoryId(id);
                      setSelectedSubcategoryId("");
                      setSubcategorySeo(initialEntitySeo);
                      setSubcategoryOgImageFile(null);
                      loadCategorySeo(id);
                    }}
                  >
                    {categories.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name} ({item?.category})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedCategoryId ? (
                <>
                  <Grid item xs={12}>
                    {renderSeoFields(
                      categorySeo,
                      setCategorySeo,
                      categoryOgImageFile,
                      setCategoryOgImageFile,
                      "category",
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleCategorySeoSave}
                      disabled={savingCategory}
                    >
                      {savingCategory ? (
                        <CircularProgress size={22} />
                      ) : (
                        "Save Category SEO"
                      )}
                    </Button>
                  </Grid>
                </>
              ) : null}
            </Grid>
          )}

          {activeTab === "subcategory" && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="subcategory-category-filter">
                    Filter By Category
                  </InputLabel>
                  <Select
                    labelId="subcategory-category-filter"
                    value={selectedCategoryId}
                    label="Filter By Category"
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setSelectedSubcategoryId("");
                      setSubcategorySeo(initialEntitySeo);
                      setSubcategoryOgImageFile(null);
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name} ({item?.category})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="subcategory-seo-select">
                    Select Subcategory
                  </InputLabel>
                  <Select
                    labelId="subcategory-seo-select"
                    value={selectedSubcategoryId}
                    label="Select Subcategory"
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedSubcategoryId(id);
                      loadSubcategorySeo(id);
                    }}
                  >
                    {filteredSubcategories.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.subcategory} ({item?.categoryId?.category || "N/A"})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedSubcategoryId ? (
                <>
                  <Grid item xs={12}>
                    {renderSeoFields(
                      subcategorySeo,
                      setSubcategorySeo,
                      subcategoryOgImageFile,
                      setSubcategoryOgImageFile,
                      "subcategory",
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleSubcategorySeoSave}
                      disabled={savingSubcategory}
                    >
                      {savingSubcategory ? (
                        <CircularProgress size={22} />
                      ) : (
                        "Save Subcategory SEO"
                      )}
                    </Button>
                  </Grid>
                </>
              ) : null}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AddSeoRequest;

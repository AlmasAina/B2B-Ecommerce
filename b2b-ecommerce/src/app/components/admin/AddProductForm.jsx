'use client';

import React, { useState } from 'react';
import {
  Box, Grid, TextField, Button, Tabs, Tab, Typography, Chip,
  Switch, FormControlLabel, Divider, Paper, IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function AddProductForm() {
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);

  // Basic fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Content
  const [highlights, setHighlights] = useState(['']);
  const [descriptionHtml, setDescriptionHtml] = useState('');

  // Media
  const [media, setMedia] = useState([{ url: '', alt: '', type: 'image', isPrimary: false, sortOrder: 0 }]);
  const [videoUrls, setVideoUrls] = useState(['']);

  // Pricing & Inventory
  const [price, setPrice] = useState({ mrp: '', sale: '', currency: 'USD' });
  const [inventory, setInventory] = useState({ track: true, qty: 0, lowStockThreshold: 5 });

  // Specs
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  // Quantity discounts (B2B)
  const [quantityDiscounts, setQuantityDiscounts] = useState([{ minQty: 10, maxQty: 49, discountType: 'percent', discountValue: 5, note: '' }]);

  // Contact only
  const [contactOnly, setContactOnly] = useState(true);

  const addItem = (setter, template) => setter(prev => [...prev, { ...template }]);
  const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        brand,
        tags,
        highlights: highlights.filter(Boolean),
        descriptionHtml,
        media: media.filter(m => m.url),
        videoUrls: videoUrls.filter(Boolean),
        price: {
          mrp: Number(price.mrp) || undefined,
          sale: Number(price.sale) || undefined,
          currency: price.currency || 'USD'
        },
        inventory: {
          track: Boolean(inventory.track),
          qty: Number(inventory.qty) || 0,
          lowStockThreshold: Number(inventory.lowStockThreshold) || 5
        },
        specs: specs.filter(s => s.key && s.value),
        quantityDiscounts: quantityDiscounts.filter(d => d.minQty && d.discountValue),
        contactOnly,
        status: { isPublished: false, isFeatured: false }
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save product');
      const json = await res.json();
      alert('Product created successfully');
      // reset minimal fields
      setTitle(''); setSlug(''); setBrand(''); setTags([]); setTagInput('');
    } catch (e) {
      alert(e.message || 'Error creating product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Basic Info" />
        <Tab label="Highlights & Description" />
        <Tab label="Media" />
        <Tab label="Pricing & Inventory" />
        <Tab label="Specs" />
        <Tab label="B2B Discounts" />
        <Tab label="Publish" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Slug" fullWidth value={slug} onChange={e => setSlug(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Brand" fullWidth value={brand} onChange={e => setBrand(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Add Tag" value={tagInput} onChange={e => setTagInput(e.target.value)} sx={{ mr: 1 }} />
              <Button onClick={() => { if (tagInput) { setTags([...tags, tagInput]); setTagInput(''); } }}>Add</Button>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.map((t, i) => (
                  <Chip key={i} label={t} onDelete={() => setTags(tags.filter((_, idx) => idx !== i))} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Highlights (bullets)</Typography>
          {highlights.map((h, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField fullWidth value={h} onChange={e => setHighlights(highlights.map((v, i) => i === idx ? e.target.value : v))} />
              <IconButton onClick={() => removeItem(setHighlights, idx)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addItem(setHighlights, '')}>Add Highlight</Button>

          <Divider sx={{ my: 2 }} />
          <TextField label="Description HTML" fullWidth multiline minRows={6} value={descriptionHtml} onChange={e => setDescriptionHtml(e.target.value)} />
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Media (URLs for now)</Typography>
          {media.map((m, idx) => (
            <Grid key={idx} container spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={12} md={5}><TextField fullWidth label="URL" value={m.url} onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, url: e.target.value } : v))} /></Grid>
              <Grid item xs={12} md={3}><TextField fullWidth label="Alt" value={m.alt} onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, alt: e.target.value } : v))} /></Grid>
              <Grid item xs={6} md={2}><TextField fullWidth label="Type" value={m.type} onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, type: e.target.value } : v))} /></Grid>
              <Grid item xs={6} md={1}><TextField fullWidth label="Order" type="number" value={m.sortOrder} onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, sortOrder: Number(e.target.value) } : v))} /></Grid>
              <Grid item xs={12} md={1}><IconButton onClick={() => removeItem(setMedia, idx)}><DeleteIcon /></IconButton></Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addItem(setMedia, { url: '', alt: '', type: 'image', isPrimary: false, sortOrder: 0 })}>Add Media</Button>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Video URLs</Typography>
          {videoUrls.map((v, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField fullWidth value={v} onChange={e => setVideoUrls(videoUrls.map((val, i) => i === idx ? e.target.value : val))} />
              <IconButton onClick={() => removeItem(setVideoUrls, idx)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addItem(setVideoUrls, '')}>Add Video URL</Button>
        </Box>
      )}

      {tab === 3 && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField label="MRP" fullWidth type="number" value={price.mrp} onChange={e => setPrice({ ...price, mrp: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Sale Price" fullWidth type="number" value={price.sale} onChange={e => setPrice({ ...price, sale: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Currency" fullWidth value={price.currency} onChange={e => setPrice({ ...price, currency: e.target.value })} /></Grid>

            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12} md={4}><TextField label="Quantity" fullWidth type="number" value={inventory.qty} onChange={e => setInventory({ ...inventory, qty: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Low Stock Threshold" fullWidth type="number" value={inventory.lowStockThreshold} onChange={e => setInventory({ ...inventory, lowStockThreshold: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><FormControlLabel control={<Switch checked={inventory.track} onChange={e => setInventory({ ...inventory, track: e.target.checked })} />} label="Track Inventory" /></Grid>
          </Grid>
        </Box>
      )}

      {tab === 4 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Specifications (key/value)</Typography>
          {specs.map((s, idx) => (
            <Grid key={idx} container spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={12} md={5}><TextField label="Key" fullWidth value={s.key} onChange={e => setSpecs(specs.map((v, i) => i === idx ? { ...v, key: e.target.value } : v))} /></Grid>
              <Grid item xs={12} md={6}><TextField label="Value" fullWidth value={s.value} onChange={e => setSpecs(specs.map((v, i) => i === idx ? { ...v, value: e.target.value } : v))} /></Grid>
              <Grid item xs={12} md={1}><IconButton onClick={() => removeItem(setSpecs, idx)}><DeleteIcon /></IconButton></Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addItem(setSpecs, { key: '', value: '' })}>Add Spec</Button>
        </Box>
      )}

      {tab === 5 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Quantity-based discounts (B2B)</Typography>
          {quantityDiscounts.map((d, idx) => (
            <Grid key={idx} container spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={6} md={2}><TextField label="Min Qty" type="number" fullWidth value={d.minQty} onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, minQty: Number(e.target.value) } : v))} /></Grid>
              <Grid item xs={6} md={2}><TextField label="Max Qty" type="number" fullWidth value={d.maxQty || ''} onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, maxQty: Number(e.target.value) || undefined } : v))} /></Grid>
              <Grid item xs={6} md={3}><TextField label="Type (percent/amount)" fullWidth value={d.discountType} onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, discountType: e.target.value } : v))} /></Grid>
              <Grid item xs={6} md={3}><TextField label="Value" type="number" fullWidth value={d.discountValue} onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, discountValue: Number(e.target.value) } : v))} /></Grid>
              <Grid item xs={12} md={1}><TextField label="Note" fullWidth value={d.note || ''} onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, note: e.target.value } : v))} /></Grid>
              <Grid item xs={12} md={1}><IconButton onClick={() => removeItem(setQuantityDiscounts, idx)}><DeleteIcon /></IconButton></Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addItem(setQuantityDiscounts, { minQty: 10, discountType: 'percent', discountValue: 5 })}>Add Tier</Button>

          <Divider sx={{ my: 2 }} />
          <FormControlLabel control={<Switch checked={contactOnly} onChange={e => setContactOnly(e.target.checked)} />} label="Contact Only (no cart)" />
        </Box>
      )}

      {tab === 6 && (
        <Box>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : 'Create Product'}
          </Button>
        </Box>
      )}
    </Paper>
  );
}


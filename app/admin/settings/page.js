'use client'

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getSettings, updateSettingImage } from '../../../services/settingsService';
import { getImageUrl } from '../../../lib/imageHelper';
import Image from 'next/image';
import { FiUpload, FiCheck } from 'react-icons/fi';

const ImageUploadCard = ({ label, description, settingKey, currentImage, onUpdated }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const updated = await updateSettingImage(settingKey, file);
      onUpdated(updated.value);
      setSuccess(true);
      setFile(null);
    } catch (e) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const displayImage = preview || getImageUrl(currentImage);

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      {/* Aperçu image */}
      <div
        className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-100 cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition"
        onClick={() => inputRef.current?.click()}
      >
        {displayImage ? (
          <Image src={displayImage} alt={label} fill className="object-cover" sizes="500px" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <FiUpload className="text-3xl" />
            <span className="text-sm">Cliquer pour choisir une image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
          <FiUpload className="text-white text-3xl" />
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <div className="flex gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:border-primary hover:text-primary transition text-sm font-semibold"
        >
          Choisir une image
        </button>
        <button
          onClick={handleSave}
          disabled={!file || loading}
          className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : success ? (
            <><FiCheck /> Enregistré</>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [settings, setSettings] = useState({ hero_image: '/assets/1.png', delivery_image: '/assets/3.png', about_image: '/assets/2.png' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(s => setSettings(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdated = (key) => (value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez les images affichées sur le site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ImageUploadCard
          label="Image Hero (Accueil)"
          description="Image principale affichée dans la section d'accueil du site."
          settingKey="hero_image"
          currentImage={settings.hero_image}
          onUpdated={handleUpdated('hero_image')}
        />
        <ImageUploadCard
          label="Image Tarifs de Livraison"
          description="Image affichée à gauche du formulaire de commande (tarifs, zones, délais)."
          settingKey="delivery_image"
          currentImage={settings.delivery_image}
          onUpdated={handleUpdated('delivery_image')}
        />
        <ImageUploadCard
          label="Image À Propos"
          description="Image affichée dans la section À Propos du site."
          settingKey="about_image"
          currentImage={settings.about_image}
          onUpdated={handleUpdated('about_image')}
        />
      </div>
    </AdminLayout>
  );
}

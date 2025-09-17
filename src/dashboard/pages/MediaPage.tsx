import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Upload, Image as ImageIcon, Trash2, Download } from 'lucide-react';

export function MediaPage() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([
    { id: '1', name: 'hero-mexico.jpg', size: 245680, url: '/dashboard/assets/destinations/playa-del-carmen-1.jpg', type: 'image' },
    { id: '2', name: 'cancun-beach.jpg', size: 387420, url: '/dashboard/assets/destinations/cancun-1.jpg', type: 'image' },
    { id: '3', name: 'tulum-ruins.jpg', size: 321540, url: '/dashboard/assets/destinations/tulum-1.jpg', type: 'image' }
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        const response = await api.uploadFile(file);
        if (response.success) {
          setFiles(prev => [...prev, {
            id: Date.now().toString(),
            name: response.data.filename,
            size: response.data.size,
            url: response.data.url,
            type: file.type.startsWith('image/') ? 'image' : 'file'
          }]);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-2">Upload and manage images and assets</p>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button disabled={uploading}>
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span className="ml-2">Upload Files</span>
                </>
              )}
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {files.map((file) => (
          <div key={file.id} className="bg-card rounded-lg border border-border overflow-hidden">
            {file.type === 'image' ? (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden flex items-center justify-center w-full h-full bg-muted">
                  <ImageIcon size={32} className="text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <ImageIcon size={32} className="text-muted-foreground" />
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-medium text-foreground truncate">{file.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
              
              <div className="flex items-center justify-between mt-4">
                <Button variant="ghost" size="sm">
                  <Download size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No media files</h3>
          <p className="text-muted-foreground">Upload images and assets to get started</p>
        </div>
      )}
    </div>
  );
}
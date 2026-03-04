import { FileText, Download, Upload, Eye, FileBadge, FileCheck, X } from "lucide-react";
import { Badge } from "../../ui/Badge";
import { useState, useEffect, useRef } from "react";

interface Document {
    id: number;
    document_name: string;
    document_type: string;
    file_size: string;
    uploaded_at: string;
}

interface DocumentInfoProps {
    employeeId?: string;
}

export function DocumentInfo({ employeeId }: DocumentInfoProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (employeeId) {
            fetchDocuments();
        }
    }, [employeeId]);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/documents/${employeeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error("Failed to fetch documents", error);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !employeeId) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('employeeId', employeeId);
        formData.append('documentType', 'General'); // Default or ask user via modal

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/documents/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                await fetchDocuments();
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = async (docId: number, docName: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/documents/download/${docId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = docName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Personnel Files</h3>
                    <p className="text-sm text-gray-500">Manage digital records and certificates.</p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading || !employeeId}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Uploading..." : "Upload Document"}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No documents found.
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{doc.document_name}</div>
                                                <div className="text-xs text-gray-500">{doc.file_size}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="info">{doc.document_type}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(doc.uploaded_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleDownload(doc.id, doc.document_name)}
                                                className="text-primary-600 hover:text-primary-800"
                                                title="Download"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center">
                    <FileBadge className="w-10 h-10 text-gray-400 mb-2" />
                    <h4 className="text-sm font-medium text-gray-900">Missing Documents</h4>
                    <p className="text-xs text-gray-500 max-w-xs mt-1">
                        Ensure all required documents are uploaded.
                    </p>
                </div>
                <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg flex items-start gap-3">
                    <FileCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-900">DMS Status</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            System storage is secure and backed up.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

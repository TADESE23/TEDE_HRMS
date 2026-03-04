import { FolderOpen, Upload, Download, FileText, Search, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

interface Document {
    id: number;
    document_name: string;
    document_type: string;
    file_size: string;
    uploaded_at: string;
    first_name: string;
    last_name: string;
    emp_id_num: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    employee_id_number: string;
}

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [docType, setDocType] = useState("General");
    const [searchQuery, setSearchQuery] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAllDocuments();
        fetchEmployees();
    }, []);

    const fetchAllDocuments = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/documents/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error("Error fetching documents", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedEmployeeId) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('employeeId', selectedEmployeeId);
        formData.append('documentType', docType);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/documents/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                await fetchAllDocuments();
                setShowUploadModal(false);
                setSelectedEmployeeId("");
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Upload error", error);
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

    const filteredDocs = documents.filter(doc =>
        doc.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.emp_id_num.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Document Management System (DMS)</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Centralized storage for all employee records and institutional documents.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Document
                    </Button>
                    <Button variant="outline" onClick={fetchAllDocuments} className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        Refresh List
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by document name, employee name, or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Document List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading documents...</td>
                            </tr>
                        ) : filteredDocs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <FolderOpen className="w-12 h-12 text-gray-300 mb-2" />
                                        <p className="text-gray-500">No documents found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{doc.document_name}</div>
                                                <div className="text-xs text-gray-500">{doc.file_size}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-sm bg-gray-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-900 dark:text-white">{doc.first_name} {doc.last_name}</div>
                                                <div className="text-xs text-gray-400">{doc.emp_id_num}</div>
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
                                        <button
                                            onClick={() => handleDownload(doc.id, doc.document_name)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Custom Upload Modal Implementation */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload New Document</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Employee</label>
                                <select
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    value={selectedEmployeeId}
                                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                >
                                    <option value="">-- Choose Employee --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id_number})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
                                <select
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                >
                                    <option value="General">General</option>
                                    <option value="CV">CV / Resume</option>
                                    <option value="Appointment">Appointment Letter</option>
                                    <option value="ID">Identification</option>
                                    <option value="Certificate">Certificate</option>
                                </select>
                            </div>

                            <div
                                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-all"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to select file</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG up to 10MB</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                    disabled={!selectedEmployeeId || isUploading}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowUploadModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                disabled={!selectedEmployeeId || isUploading}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploading ? "Uploading..." : "Select File"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

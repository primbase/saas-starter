'use client'

import { useState } from 'react'
import {
    FileText,
    Folder,
    Image,
    File,
    Download,
    Trash2,
    MoreVertical,
    Upload,
    Search,
    Grid,
    List,
    Plus,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type FileType = 'folder' | 'document' | 'image' | 'other'

interface FileItem {
    id: string
    name: string
    type: FileType
    size?: string
    modified: string
    items?: number
}

// Mock file data
const mockFiles: FileItem[] = [
    { id: '1', name: 'Projects', type: 'folder', modified: '2 hours ago', items: 12 },
    { id: '2', name: 'Documents', type: 'folder', modified: '1 day ago', items: 45 },
    { id: '3', name: 'Images', type: 'folder', modified: '3 days ago', items: 128 },
    { id: '4', name: 'Project Proposal.pdf', type: 'document', size: '2.4 MB', modified: '5 hours ago' },
    { id: '5', name: 'Meeting Notes.docx', type: 'document', size: '156 KB', modified: '1 day ago' },
    { id: '6', name: 'Brand Guidelines.pdf', type: 'document', size: '8.2 MB', modified: '2 days ago' },
    { id: '7', name: 'Hero Banner.png', type: 'image', size: '1.8 MB', modified: '4 days ago' },
    { id: '8', name: 'Logo.svg', type: 'image', size: '24 KB', modified: '1 week ago' },
    { id: '9', name: 'Presentation.pptx', type: 'other', size: '5.6 MB', modified: '2 weeks ago' },
]

const getFileIcon = (type: FileType) => {
    switch (type) {
        case 'folder':
            return Folder
        case 'document':
            return FileText
        case 'image':
            return Image
        default:
            return File
    }
}

const getFileColor = (type: FileType) => {
    switch (type) {
        case 'folder':
            return 'text-amber-500'
        case 'document':
            return 'text-blue-500'
        case 'image':
            return 'text-pink-500'
        default:
            return 'text-gray-500'
    }
}

export default function DocumentsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredFiles = mockFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const folders = filteredFiles.filter(f => f.type === 'folder')
    const files = filteredFiles.filter(f => f.type !== 'folder')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground">
                        Manage your files and folders.
                    </p>
                </div>
                <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                </Button>
            </div>

            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Storage Info */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Storage Used</span>
                        <span className="text-sm text-muted-foreground">4.2 GB of 10 GB</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[42%] bg-primary rounded-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Folders Section */}
            {folders.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Folders</h2>
                    <div className={cn(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                            : 'space-y-2'
                    )}>
                        {folders.map((folder) => {
                            const Icon = getFileIcon(folder.type)
                            return viewMode === 'grid' ? (
                                <Card key={folder.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                                <Icon className="h-6 w-6 text-amber-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{folder.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {folder.items} items
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div
                                    key={folder.id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                                >
                                    <Icon className={cn('h-5 w-5', getFileColor(folder.type))} />
                                    <span className="flex-1 font-medium">{folder.name}</span>
                                    <span className="text-sm text-muted-foreground">{folder.items} items</span>
                                    <span className="text-sm text-muted-foreground">{folder.modified}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Files</h2>
                    <div className={cn(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                            : 'space-y-2'
                    )}>
                        {files.map((file) => {
                            const Icon = getFileIcon(file.type)
                            return viewMode === 'grid' ? (
                                <Card key={file.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 bg-muted rounded-lg">
                                                <Icon className={cn('h-6 w-6', getFileColor(file.type))} />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className="font-medium truncate text-sm">{file.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-muted-foreground">{file.size}</span>
                                            <span className="text-xs text-muted-foreground">{file.modified}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                                >
                                    <Icon className={cn('h-5 w-5', getFileColor(file.type))} />
                                    <span className="flex-1 font-medium truncate">{file.name}</span>
                                    <span className="text-sm text-muted-foreground">{file.size}</span>
                                    <span className="text-sm text-muted-foreground hidden sm:block">{file.modified}</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">No files found</h3>
                    <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
                    </p>
                </div>
            )}
        </div>
    )
}

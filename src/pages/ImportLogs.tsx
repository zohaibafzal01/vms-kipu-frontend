"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExportCSVModal } from "@/components/modals/ExportCSVModal";
import { DateRangeModal } from "@/components/modals/DateRangeModal";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import kipuApi from "@/api/kipu";
import { useDebounce } from "use-debounce";

export default function ImportLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await kipuApi.getImportsRuns({
        page,
        limit: 10,
        search: debouncedSearchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        source: sourceFilter !== "all" ? sourceFilter : undefined,
      });
      setLogs(response?.data || []);
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch import logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, debouncedSearchTerm, statusFilter, sourceFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLogs();
    setIsRefreshing(false);
  };

  const handleDateRangeSelect = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    console.log("Date range selected:", from, to);
  };

  const filteredLogs = logs.filter((log) => {
    const mappedStatus =
      statusFilter === "pending" ? "in_progress" : statusFilter;

    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      log?.id.toLowerCase().includes(lowerSearch) ||
      log?.status?.toLowerCase().includes(lowerSearch) ||
      log?.source?.toLowerCase().includes(lowerSearch) ||
      log?.record_count?.toString().includes(lowerSearch) ||
      log?.duration?.toString().includes(lowerSearch) ||
      log?.started_at?.toLowerCase().includes(lowerSearch) ||
      log?.completed_at?.toLowerCase().includes(lowerSearch);

    const matchesStatus = mappedStatus === "all" || log.status === mappedStatus;

    const matchesSource =
      sourceFilter === "all" || log.source.toLowerCase() === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import Logs</h1>
          <p className="text-muted-foreground">
            Monitor import run history and troubleshoot issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setPage(1);
                setStatusFilter(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sourceFilter}
              onValueChange={(value) => {
                setPage(1);
                setSourceFilter(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="polling">Polling</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Import Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Import Run History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {!isLoading && filteredLogs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No logs found for selected filters.
                </TableCell>
              </TableRow>
            )}

            {isLoading ? (
              <div className="w-full h-[300px] table-caption content-center place-items-center ">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      #{log.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {format(new Date(log.started_at), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.started_at), "HH:mm:ss")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          log?.status === "in_progress"
                            ? "pending"
                            : log?.status
                        }
                      >
                        {log?.status === "in_progress"
                          ? "Pending"
                          : log?.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{log.record_count}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.source}</Badge>
                    </TableCell>
                    <TableCell>{log.duration}s</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Import Log Details</DialogTitle>
                          </DialogHeader>
                          {selectedLog && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Import ID
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    #{selectedLog.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>
                                  <div className="mt-1">
                                    <StatusBadge status={selectedLog.status}>
                                      {selectedLog.status}
                                    </StatusBadge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Started
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(
                                      new Date(selectedLog.started_at),
                                      "PPpp"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Duration
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedLog.duration}s
                                  </p>
                                </div>
                              </div>
                              {selectedLog.error_log && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Errors
                                  </label>
                                  <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-sm text-destructive">
                                      {selectedLog.error_log}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExportCSVModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        dataType="Import Logs"
        availableColumns={[
          "id",
          "started_at",
          "status",
          "record_count",
          "source",
          "duration",
          "error_log",
        ]}
      />

      <DateRangeModal
        open={showDateModal}
        onOpenChange={setShowDateModal}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </div>
  );
}

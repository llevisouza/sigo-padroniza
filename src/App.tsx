import { AnimatePresence } from "motion/react";
import { FormAluno } from "./components/FormAluno";
import { AppHeader } from "./components/AppHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { ExportModal } from "./components/ExportModal";
import { NotificationToast } from "./components/NotificationToast";
import { ValidationBanner } from "./components/ValidationBanner";
import { WorkspaceView } from "./components/WorkspaceView";
import { useAlunoWorkspace } from "./hooks/useAlunoWorkspace";

export default function App() {
  const workspace = useAlunoWorkspace();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AppHeader
        alunosCount={workspace.alunos.length}
        onExport={workspace.handleExport}
        searchField={workspace.searchField}
        searchTerm={workspace.searchTerm}
        onSearchFieldChange={workspace.setSearchFieldAndReset}
        onSearchTermChange={workspace.setSearchTermAndReset}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ValidationBanner
          visible={workspace.alunos.length > 0}
          stats={workspace.stats}
          filterMode={workspace.filterMode}
          errorFieldFilter={workspace.errorFieldFilter}
          onApplyFilter={workspace.applyFilter}
          onClearErrorFieldFilter={workspace.clearErrorFieldFilter}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <DashboardSidebar
            stats={workspace.stats}
            onUpload={workspace.handleUpload}
            onUploadError={(message) => workspace.showNotification("error", message)}
          />

          <WorkspaceView
            activeTab={workspace.activeTab}
            filterMode={workspace.filterMode}
            exportReport={workspace.exportReport}
            hasReportContent={workspace.hasReportContent}
            alunos={workspace.alunos}
            filteredAlunos={workspace.filteredAlunos}
            paginatedAlunos={workspace.paginatedAlunos}
            insightsById={workspace.insightsById}
            currentPage={workspace.currentPage}
            totalPages={workspace.totalPages}
            pageSize={workspace.pageSize}
            onTabChange={workspace.setActiveTab}
            onClearData={workspace.handleClearImportedData}
            onAdjustAll={workspace.handleAdjustAll}
            onAddAluno={workspace.handleAddAluno}
            onDeleteAluno={workspace.handleDeleteAluno}
            onEditAluno={workspace.handleEditAluno}
            onAdjustAluno={workspace.handleAdjustAluno}
            onMainPageChange={workspace.setCurrentPage}
            onMainPageSizeChange={workspace.setMainPageSize}
            statsAdjustableFields={workspace.stats.adjustableFields}
            adjustmentHistory={workspace.adjustmentHistory}
            paginatedAdjustmentHistory={workspace.paginatedAdjustmentHistory}
            historyCurrentPage={workspace.historyCurrentPage}
            totalHistoryPages={workspace.totalHistoryPages}
            historyPageSize={workspace.historyPageSize}
            onHistoryPageChange={workspace.setHistoryCurrentPage}
            onHistoryPageSizeChange={workspace.setHistoryPageSizeAndReset}
            alunosById={workspace.alunosById}
            onRevertAdjustment={workspace.handleRevertAdjustment}
            historyStats={workspace.historyStats}
            reportIssues={workspace.reportIssues}
            paginatedReportIssues={workspace.paginatedReportIssues}
            issuesCurrentPage={workspace.issuesCurrentPage}
            totalIssuePages={workspace.totalIssuePages}
            issuesPageSize={workspace.issuesPageSize}
            onIssuesPageChange={workspace.setIssuesCurrentPage}
            onIssuesPageSizeChange={workspace.setIssuesPageSizeAndReset}
          />
        </div>
      </main>

      <AnimatePresence mode="wait">
        {workspace.isFormOpen && (
          <FormAluno
            key="aluno-form-modal"
            aluno={workspace.editingAluno}
            onSave={workspace.handleSaveAluno}
            onClose={workspace.closeForm}
          />
        )}

        <ExportModal
          open={workspace.isExportModalOpen}
          onClose={workspace.closeExportModal}
          onConfirm={workspace.handleConfirmExport}
        />

        <NotificationToast notification={workspace.notification} onClose={workspace.dismissNotification} />
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import Sidebar, { type AdminSection } from './components/Sidebar';
import HomeView from './views/HomeView';
import AIAgentView from './views/AIAgentView';
import PlaceholderView from './views/PlaceholderView';
import EmptyView from './views/EmptyView';
import ResidentsView from './views/ResidentsView';
import TasksView from './views/TasksView';
import ContentSectionView from './views/ContentSectionView';
import { isContentAdminSection } from './data/contentSectionsData';
import SidePanel from './components/SidePanel';
import ResidentPanelContent from './components/ResidentPanelContent';
import SourceLogPanel from './components/SourceLogPanel';
import ResidentAppPreviewModal from './components/ResidentAppPreviewModal';
import { INBOX_ITEMS } from './data/adminMockData';
import type { Resident } from './data/residentsMockData';
import { SOURCE_LOGS, type FlowSourceId } from './data/sourceLogsData';
import { ADMIN_TASKS } from './data/tasksMockData';

export default function AdminApp() {
  const [section, setSection] = useState<AdminSection>('inbox');
  const [inbox, setInbox] = useState(INBOX_ITEMS);
  const [tasks, setTasks] = useState(ADMIN_TASKS);
  const [flowSource, setFlowSource] = useState<FlowSourceId | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [residentPreviewOpen, setResidentPreviewOpen] = useState(false);
  const pendingCount = inbox.filter((i) => i.status !== 'handled').length;
  const taskCount = tasks.filter((task) => !task.completed).length;
  const sourceLog = flowSource ? SOURCE_LOGS[flowSource] : null;

  const handleNavigate = (nextSection: AdminSection) => {
    setSection(nextSection);
    setFlowSource(null);
    setSelectedResident(null);
  };

  const closeSidePanel = () => {
    setFlowSource(null);
    setSelectedResident(null);
  };

  const handleApprove = (id: string) => {
    setInbox((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'handled' as const } : item))
    );
  };

  const handleDismiss = (id: string) => {
    setInbox((items) => items.filter((item) => item.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks((items) =>
      items.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
    );
  };

  return (
    <div className="admin-stage">
      <div className="admin-screen" dir="rtl">
        <Sidebar
          active={section}
          onNavigate={handleNavigate}
          onOpenResidentPreview={() => setResidentPreviewOpen(true)}
          pendingCount={pendingCount}
          taskCount={taskCount}
        />
        <main className="admin-main">
          {section === 'inbox' && (
            <HomeView
              inbox={inbox}
              onApprove={handleApprove}
              onDismiss={handleDismiss}
            />
          )}
          {section === 'tasks' && <TasksView tasks={tasks} onToggleTask={handleToggleTask} />}
          {section === 'ai' && <AIAgentView />}
          {isContentAdminSection(section) && <ContentSectionView section={section} />}
          {section === 'residents' && (
            <ResidentsView onSelectResident={setSelectedResident} />
          )}
          {section === 'new' && <EmptyView onSelectNode={setFlowSource} />}
          {section === 'settings' && (
            <PlaceholderView
              title="הגדרות"
              subtitle="כללי אוטומציה, אינטגרציות והרשאות"
              emoji="⚙️"
            />
          )}
        </main>
        <SidePanel
          isOpen={flowSource !== null || selectedResident !== null}
          onClose={closeSidePanel}
          title={selectedResident?.name ?? sourceLog?.title}
          subtitle={selectedResident ? 'כרטיס תושב/ת' : sourceLog?.subtitle}
        >
          {selectedResident ? (
            <ResidentPanelContent key={selectedResident.id} resident={selectedResident} />
          ) : (
            sourceLog && (
              <SourceLogPanel
                key={sourceLog.id}
                source={sourceLog}
                onOpenInbox={() => handleNavigate('inbox')}
              />
            )
          )}
        </SidePanel>
      </div>
      <ResidentAppPreviewModal
        isOpen={residentPreviewOpen}
        onClose={() => setResidentPreviewOpen(false)}
      />
    </div>
  );
}

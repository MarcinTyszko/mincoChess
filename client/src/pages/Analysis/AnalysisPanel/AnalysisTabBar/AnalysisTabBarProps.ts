import { AnalysisTab } from ".";

interface AnalysisTabBarProps {
    activeTab: AnalysisTab;
    onTabSelect: (tab: AnalysisTab) => void;
}

export default AnalysisTabBarProps;
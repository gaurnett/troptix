import LoadingIndicator from '@/components/ui/loading-indicator';
// TODO: Merge with LoadingIndicator component
export function Spinner({ text }) {
  return (
    <div className="flex flex-col w-full justify-center item-center">
      <LoadingIndicator size="w-12 h-12" />
      <div className="text-center mt-4 text-base">{text}</div>
    </div>
  );
}

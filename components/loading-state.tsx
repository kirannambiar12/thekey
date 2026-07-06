interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-600">
      {message}
    </div>
  );
}

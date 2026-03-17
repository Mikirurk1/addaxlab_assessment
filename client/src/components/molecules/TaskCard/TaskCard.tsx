import { useDispatch } from 'react-redux';
import { Card, LabelsStrip, LabelSegment, CardBody, CardTitle } from './TaskCard.styled';
import { setEventModalOpen, setEditModalTaskId } from '@/features/calendar/model';
import type { TaskItem } from '@/features/calendar/types';

interface TaskCardProps {
  task: TaskItem;
  index: number;
  /** One or more hex colors for the label bar(s) — like Trello labels */
  labelColors: string[];
  isHidden: boolean;
  onDropAt: (e: React.DragEvent, index: number) => void;
}

export function TaskCard({
  task,
  index,
  labelColors,
  isHidden,
  onDropAt,
}: TaskCardProps) {
  const dispatch = useDispatch();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setEditModalTaskId(task._id));
    dispatch(setEventModalOpen(true));
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ taskId: task._id, date: task.date })
    );
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('dragging');
  };

  return (
    <Card
      data-task-card
      draggable
      $isHidden={isHidden}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropAt(e, index);
      }}
      onClick={handleClick}
      title="Клікніть для редагування, перетягніть для переміщення"
    >
      <LabelsStrip>
        {labelColors.map((color, i) => (
          <LabelSegment key={`${color}-${i}`} $color={color} />
        ))}
      </LabelsStrip>
      <CardBody>
        <CardTitle>{task.title}</CardTitle>
      </CardBody>
    </Card>
  );
}

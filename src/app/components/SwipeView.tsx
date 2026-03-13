import { useState, useRef } from 'react';
import { X, Heart, RotateCcw } from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { Task } from '../types';
import { Button } from './ui/button';

interface SwipeViewProps {
  tasks: Task[];
  queueId: string;
  onComplete: (orderedTasks: Task[]) => void;
  onCancel: () => void;
}

export function SwipeView({ tasks, queueId, onComplete, onCancel }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [lowPriorityTasks, setLowPriorityTasks] = useState<Task[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentTask = tasks[currentIndex];
  const isComplete = currentIndex >= tasks.length;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - high priority
        setHighPriorityTasks([...highPriorityTasks, currentTask]);
        setDirection('right');
      } else {
        // Swiped left - low priority
        setLowPriorityTasks([...lowPriorityTasks, currentTask]);
        setDirection('left');
      }
      
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        x.set(0);
        setDirection(null);
      }, 200);
    } else {
      x.set(0);
    }
  };

  const handleSwipe = (isHighPriority: boolean) => {
    if (isHighPriority) {
      setHighPriorityTasks([...highPriorityTasks, currentTask]);
      setDirection('right');
      x.set(300);
    } else {
      setLowPriorityTasks([...lowPriorityTasks, currentTask]);
      setDirection('left');
      x.set(-300);
    }
    
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      x.set(0);
      setDirection(null);
    }, 200);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      const previousTask = tasks[currentIndex - 1];
      
      // Remove from high or low priority
      setHighPriorityTasks(highPriorityTasks.filter(t => t.id !== previousTask.id));
      setLowPriorityTasks(lowPriorityTasks.filter(t => t.id !== previousTask.id));
      
      setCurrentIndex(currentIndex - 1);
      x.set(0);
    }
  };

  const handleFinish = () => {
    const orderedTasks = [...highPriorityTasks, ...lowPriorityTasks];
    onComplete(orderedTasks);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">All Done!</h2>
          <p className="text-gray-600 mb-6">
            You've prioritized all {tasks.length} tasks. 
            {highPriorityTasks.length} high priority, {lowPriorityTasks.length} low priority.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleFinish}>
              Apply Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b bg-white/80 backdrop-blur">
        <div>
          <p className="text-sm text-gray-600">
            {currentIndex + 1} / {tasks.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            High: {highPriorityTasks.length} | Low: {lowPriorityTasks.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={currentIndex === 0}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Exit
          </Button>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="relative w-full max-w-md h-96">
          {/* Instructions */}
          <div className="absolute -top-16 left-0 right-0 text-center">
            <p className="text-sm text-gray-600">
              Swipe right for high priority, left for low priority
            </p>
          </div>

          {/* Card Stack */}
          <motion.div
            className="absolute inset-0"
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <div className="w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-gray-200">
              <h3 className="text-2xl font-semibold text-center mb-4">
                {currentTask.title}
              </h3>
              {currentTask.description && (
                <p className="text-gray-600 text-center">
                  {currentTask.description}
                </p>
              )}
            </div>

            {/* Swipe Indicators */}
            <div 
              className={`absolute top-8 left-8 px-4 py-2 border-4 border-red-500 text-red-500 rounded-lg font-bold text-xl rotate-[-25deg] transition-opacity ${
                direction === 'left' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              LOW
            </div>
            <div 
              className={`absolute top-8 right-8 px-4 py-2 border-4 border-green-500 text-green-500 rounded-lg font-bold text-xl rotate-[25deg] transition-opacity ${
                direction === 'right' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              HIGH
            </div>
          </motion.div>

          {/* Next card preview */}
          {currentIndex + 1 < tasks.length && (
            <div className="absolute inset-0 -z-10 scale-95 opacity-50">
              <div className="w-full h-full bg-white rounded-2xl shadow-xl border-2 border-gray-200" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex gap-4 justify-center bg-white/80 backdrop-blur border-t">
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => handleSwipe(false)}
        >
          <X className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50"
          onClick={() => handleSwipe(true)}
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

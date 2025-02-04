import details from '../assets/stepper/details.svg';
import detailsblue from '../assets/stepper/detailsblue.svg';
import inspection from '../assets/stepper/inspection.svg';
import inspectionblue from '../assets/stepper/inspectionblue.svg';
import media from '../assets/stepper/media.svg';
import mediablue from '../assets/stepper/mediablue.svg';
import compare from '../assets/stepper/compare.svg';
import compareblue from '../assets/stepper/compareblue.svg';
import submit from '../assets/stepper/submit.svg';
import submitblue from '../assets/stepper/submitblue.svg';

// Define a type for allowed step labels
type StepLabel = 'Your details' | 'Inspection' | 'Upload Media' | 'Compare' | 'Review & Submit';

const stepImages: Record<StepLabel, { normal: string; completed: string }> = {
  'Your details': { normal: details, completed: detailsblue },
  Inspection: { normal: inspection, completed: inspectionblue },
  'Upload Media': { normal: media, completed: mediablue },
  Compare: { normal: compare, completed: compareblue },
  'Review & Submit': { normal: submit, completed: submitblue },
};

interface Step {
  label: StepLabel;
  status: 'completed' | 'current' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="flex justify-between mb-12 relative">
      {/* Connecting line in background */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
          style={{
            width: `${(steps.findIndex(s => s.status === 'current') / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {steps.map((step, index) => (
        <div key={step.label} className={`flex flex-col items-center  w-1/5 relative z-1 $`}>
          {/* Image for step */}
          <img
            src={step.status === 'completed' ? stepImages[step.label].completed : stepImages[step.label].normal}
            alt={step.label}
            className={`w-12 h-12 mb-2 transition-all border duration-300 p-2 rounded-full ${step.status === 'completed' ?'bg-blue-500' :'bg-white'}`}
          />

          {/* Label */}
          <span
            className={`
              text-sm font-medium text-center
              transition-colors duration-300
              ${step.status === 'completed' ? 'text-blue-600' : ''}
              ${step.status === 'current' ? 'text-blue-600' : ''}
              ${step.status === 'upcoming' ? 'text-gray-500' : ''}
            `}
          >
            {step.label}
          </span>

          {/* Step number */}
          <span className="text-xs text-gray-400 mt-1">Step {index + 1}</span>
        </div>
      ))}
    </div>
  );
}

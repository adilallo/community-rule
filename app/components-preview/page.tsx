"use client";

import { useState } from "react";
import Tooltip from "../components/Tooltip";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Stepper from "../components/Stepper";
import Progress from "../components/Progress";
import Create from "../components/Create";
import Input from "../components/Input";
import InputWithCounter from "../components/InputWithCounter";
import IconCard from "../components/IconCard";
import { getAssetPath } from "../../lib/assetUtils";

export default function ComponentsPreview() {
  const [alertVisible, setAlertVisible] = useState({
    default: true,
    positive: true,
    warning: true,
    danger: true,
    banner: true,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [policyName, setPolicyName] = useState("");

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-[var(--spacing-scale-032)]">
      <div className="max-w-[1200px] mx-auto space-y-[var(--spacing-scale-064)]">
        <header className="space-y-[var(--spacing-scale-008)]">
          <h1 className="font-bricolage-grotesque text-[48px] leading-[56px] font-bold text-[var(--color-content-default-primary)]">
            Component Preview
          </h1>
          <p className="font-inter text-[18px] leading-[24px] text-[var(--color-content-default-secondary)]">
            Temporary page for viewing and testing new components
          </p>
        </header>

        {/* Tooltip Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Tooltip Component
          </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="flex flex-wrap gap-[var(--spacing-scale-024)] items-center">
              <Tooltip text="Tooltip positioned at top" position="top">
                <Button variant="default" size="medium">
                  Hover me (Top)
                </Button>
              </Tooltip>

              <Tooltip text="Tooltip positioned at bottom" position="bottom">
                <Button variant="primary" size="medium">
                  Hover me (Bottom)
                </Button>
              </Tooltip>

              <Tooltip text="Disabled tooltip" disabled>
                <Button variant="secondary" size="medium">
                  Disabled Tooltip
                </Button>
              </Tooltip>

              <Tooltip text="Tooltip with icon button" position="top">
                <button className="p-[var(--spacing-scale-012)] rounded-full hover:bg-[var(--color-surface-default-tertiary)] transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 9V11M10 15H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* Alert Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Alert Component
          </h2>

          <div className="space-y-[var(--spacing-scale-024)]">
            {/* Toast Alerts */}
            <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-016)]">
              <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                Toast Alerts
              </h3>

              {alertVisible.default && (
                <Alert
                  title="Short alert banner message goes here"
                  description="Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse."
                  status="default"
                  type="toast"
                  onClose={() =>
                    setAlertVisible({ ...alertVisible, default: false })
                  }
                />
              )}

              {alertVisible.positive && (
                <Alert
                  title="Short alert banner message goes here"
                  description="Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse."
                  status="positive"
                  type="toast"
                  onClose={() =>
                    setAlertVisible({ ...alertVisible, positive: false })
                  }
                />
              )}

              {alertVisible.warning && (
                <Alert
                  title="Short alert banner message goes here"
                  description="Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse."
                  status="warning"
                  type="toast"
                  onClose={() =>
                    setAlertVisible({ ...alertVisible, warning: false })
                  }
                />
              )}

              {alertVisible.danger && (
                <Alert
                  title="Short alert banner message goes here"
                  description="Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse."
                  status="danger"
                  type="toast"
                  onClose={() =>
                    setAlertVisible({ ...alertVisible, danger: false })
                  }
                />
              )}
            </div>

            {/* Banner Alerts */}
            <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-016)]">
              <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                Banner Alerts
              </h3>

              {alertVisible.banner && (
                <Alert
                  title="Short alert banner message goes here"
                  description="Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse."
                  status="default"
                  type="banner"
                  onClose={() =>
                    setAlertVisible({ ...alertVisible, banner: false })
                  }
                />
              )}

              <Alert
                title="Positive banner alert"
                description="This is a positive banner message"
                status="positive"
                type="banner"
              />

              <Alert
                title="Warning banner alert"
                description="This is a warning banner message"
                status="warning"
                type="banner"
              />

              <Alert
                title="Danger banner alert"
                description="This is a danger banner message"
                status="danger"
                type="banner"
              />
            </div>
          </div>
        </section>

        {/* Stepper Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Stepper Component
          </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="space-y-[var(--spacing-scale-016)]">
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Step 1 of 5
                </p>
                <Stepper active={1} totalSteps={5} />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Step 2 of 5
                </p>
                <Stepper active={2} totalSteps={5} />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Step 3 of 5
                </p>
                <Stepper active={3} totalSteps={5} />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Step 4 of 5
                </p>
                <Stepper active={4} totalSteps={5} />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Step 5 of 5
                </p>
                <Stepper active={5} totalSteps={5} />
              </div>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Progress Component
          </h2>

          <div className="bg-white rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="space-y-[var(--spacing-scale-016)]">
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 1-0
                </p>
                <Progress progress="1-0" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 1-1
                </p>
                <Progress progress="1-1" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 1-2
                </p>
                <Progress progress="1-2" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 1-3
                </p>
                <Progress progress="1-3" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 1-4
                </p>
                <Progress progress="1-4" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 1-5
                </p>
                <Progress progress="1-5" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 2-0
                </p>
                <Progress progress="2-0" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 2-1
                </p>
                <Progress progress="2-1" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 2-2
                </p>
                <Progress progress="2-2" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 3-0
                </p>
                <Progress progress="3-0" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 3-1
                </p>
                <Progress progress="3-1" />
              </div>
              <div>
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-008)]">
                  Progress: 3-2
                </p>
                <Progress progress="3-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Create Component Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Create Component
          </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="space-y-[var(--spacing-scale-016)]">
              <Button
                variant="primary"
                size="medium"
                onClick={() => setCreateOpen(true)}
              >
                Open Create Dialog
              </Button>

              <div className="space-y-[var(--spacing-scale-008)]">
                <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)]">
                  Step {createStep} of 3
                </p>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCreateStep((prev) => Math.max(1, prev - 1))}
                  disabled={createStep === 1}
                >
                  Previous Step
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCreateStep((prev) => Math.min(3, prev + 1))}
                  disabled={createStep === 3}
                >
                  Next Step
                </Button>
              </div>
            </div>
          </div>

          <Create
            isOpen={createOpen}
            onClose={() => setCreateOpen(false)}
            title={
              createStep === 1
                ? "What do you call your group's new policy?"
                : createStep === 2
                  ? "How should conflicts be resolved?"
                  : "Review your policy"
            }
            description="You can also combine or add new approaches to the list"
            showBackButton={true}
            showNextButton={true}
            onBack={() => setCreateStep((prev) => Math.max(1, prev - 1))}
            onNext={() => setCreateStep((prev) => Math.min(3, prev + 1))}
            backButtonText="Back"
            nextButtonText={createStep === 3 ? "Finish" : "Next"}
            nextButtonDisabled={createStep === 1 && !policyName.trim()}
            currentStep={createStep}
            totalSteps={3}
          >
            <div className="space-y-[var(--spacing-scale-024)]">
              {createStep === 1 && (
                <InputWithCounter
                  label="Label"
                  placeholder="Policy name"
                  value={policyName}
                  onChange={setPolicyName}
                  maxLength={48}
                  showHelpIcon
                />
              )}
              {createStep === 2 && (
                <div className="space-y-[var(--spacing-scale-008)]">
                  <Input
                    label="Conflict Resolution Method"
                    placeholder="Enter method"
                    value=""
                  />
                  <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-primary)]">
                    Select how conflicts should be resolved in your group.
                  </p>
                </div>
              )}
              {createStep === 3 && (
                <div className="space-y-[var(--spacing-scale-016)]">
                  <p className="font-inter text-[16px] leading-[24px] text-[var(--color-content-default-primary)]">
                    Review your policy configuration before finalizing.
                  </p>
                  <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-200,8px)] p-[var(--spacing-scale-016)]">
                    <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)]">
                      Policy details will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Create>
        </section>

        {/* IconCard Component Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            IconCard Component
          </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="flex flex-wrap gap-[var(--spacing-scale-024)]">
              <IconCard
                icon={
                  <img
                    src={getAssetPath("assets/Vector_WorkerCoop.svg")}
                    alt=""
                    className="w-[36px] h-[36px]"
                    width="36"
                    height="36"
                  />
                }
                title="Worker's cooperatives"
                description="Employee-owned businesses often need to clarify how power is shared, decisions are made, and how processes operate within their organizations."
                onClick={() => {
                  // IconCard clicked handler
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

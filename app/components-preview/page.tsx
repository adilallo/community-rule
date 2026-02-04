"use client";

import { useState } from "react";
import TextInput from "../components/TextInput";
import Checkbox from "../components/Checkbox";
import CheckboxGroup from "../components/CheckboxGroup";
import RadioGroup from "../components/RadioGroup";

export default function ComponentsPreview() {
  const [defaultInputValue, setDefaultInputValue] = useState("");
  const [activeInputValue, setActiveInputValue] = useState("");
  const [errorInputValue, setErrorInputValue] = useState("");
  const [standardCheckbox, setStandardCheckbox] = useState(false);
  const [inverseCheckbox, setInverseCheckbox] = useState(false);
  const [checkboxGroupValues, setCheckboxGroupValues] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState("");

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

        {/* Text Input Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Text Input Component
          </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="space-y-[var(--spacing-scale-016)]">
              <div>
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-012)]">
                  States
                </h3>
                <div className="space-y-[var(--spacing-scale-016)]">
                  <TextInput
                    label="Default Text Input"
                    placeholder="Enter text"
                    value={defaultInputValue}
                    onChange={(e) => setDefaultInputValue(e.target.value)}
                  />
                  <TextInput
                    label="Interactive Text Input (click = active, tab = focus)"
                    placeholder="Enter text"
                    value={activeInputValue}
                    onChange={(e) => setActiveInputValue(e.target.value)}
                  />
                  <TextInput
                    label="Disabled Text Input"
                    placeholder="Enter text"
                    value=""
                    disabled
                  />
                  <TextInput
                    label="Error Text Input"
                    placeholder="Enter text"
                    value={errorInputValue}
                    onChange={(e) => setErrorInputValue(e.target.value)}
                    error
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Checkbox Section */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Checkbox Component
          </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="space-y-[var(--spacing-scale-016)]">
              <div>
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-012)]">
                  Standard Mode
                </h3>
                <div className="space-y-[var(--spacing-scale-016)]">
                  <Checkbox
                    label="Standard Checkbox"
                    checked={standardCheckbox}
                    mode="standard"
                    onChange={({ checked }) => setStandardCheckbox(checked)}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-012)]">
                  Inverse Mode
                </h3>
                <div className="space-y-[var(--spacing-scale-016)]">
                  <Checkbox
                    label="Inverse Checkbox"
                    checked={inverseCheckbox}
                    mode="inverse"
                    onChange={({ checked }) => setInverseCheckbox(checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

            {/* Checkbox Group Section */}
            <section className="space-y-[var(--spacing-scale-024)]">
              <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
                Checkbox Group Component
              </h2>

              <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
                <div className="space-y-[var(--spacing-scale-016)]">
                  <div>
                    <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-012)]">
                      Standard Mode
                    </h3>
                    <div className="space-y-[var(--spacing-scale-016)]">
                      <CheckboxGroup
                        name="standard-checkbox-group"
                        value={checkboxGroupValues}
                        onChange={({ value }) => setCheckboxGroupValues(value)}
                        mode="standard"
                        options={[
                          { value: "option1", label: "Checkbox label" },
                          {
                            value: "option2",
                            label: "Checkbox label",
                            subtext: "Nunc sed hendrerit consequat.",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-012)]">
                      Inverse Mode
                    </h3>
                    <div className="space-y-[var(--spacing-scale-016)]">
                      <CheckboxGroup
                        name="inverse-checkbox-group"
                        value={checkboxGroupValues}
                        onChange={({ value }) => setCheckboxGroupValues(value)}
                        mode="inverse"
                        options={[
                          { value: "option3", label: "Checkbox label" },
                          {
                            value: "option4",
                            label: "Checkbox label",
                            subtext: "Nunc sed hendrerit consequat.",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Radio Group Section */}
            <section className="space-y-[var(--spacing-scale-024)]">
              <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
                Radio Group Component
              </h2>

          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="space-y-[var(--spacing-scale-016)]">
              <div>
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-012)]">
                  States
                </h3>
                <div className="space-y-[var(--spacing-scale-016)]">
                  <RadioGroup
                    name="default-radio"
                    value=""
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ]}
                  />
                  <RadioGroup
                    name="interactive-radio"
                    value={radioValue}
                    onChange={({ value }) => setRadioValue(value)}
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ]}
                  />
                  <RadioGroup
                    name="disabled-radio"
                    value=""
                    disabled
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

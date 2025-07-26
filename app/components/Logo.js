export default function Logo() {
  return (
    <div
      className="flex items-center"
      style={{
        height: "40px",
        gap: "8px",
      }}
    >
      {/* Logo Text */}
      <div
        className="font-['Bricolage_Grotesque']"
        style={{
          color: "var(--color-content-default-primary)",
          fontSize: "21.97px",
          lineHeight: "27.05px",
          fontWeight: "400",
          letterSpacing: "0px",
        }}
      >
        CommunityRule
      </div>

      {/* Vector Icon */}
      <img
        src="/assets/Logo.svg"
        alt="CommunityRule Logo Icon"
        width={27.05}
        height={27.05}
        className="flex-shrink-0"
      />
    </div>
  );
}

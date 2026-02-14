import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const brand = {
  plumDark: "#2D1F2D",
  plum: "#3D2B3A",
  peach: "#DBA88C",
  cream: "#FAF5F2",
};

type EmailShellProps = {
  preview: string;
  heading: string;
  children: React.ReactNode;
};

export function EmailShell({ preview, heading, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: brand.cream, margin: "0", padding: "24px 12px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            border: `1px solid ${brand.peach}`,
            padding: "24px",
            maxWidth: "560px",
          }}
        >
          <Text style={{ color: brand.plum, margin: "0 0 10px", fontSize: "14px" }}>Sanaa Glam</Text>
          <Text
            style={{
              color: brand.plumDark,
              fontSize: "24px",
              lineHeight: "1.3",
              margin: "0 0 14px",
              fontWeight: "700",
            }}
          >
            {heading}
          </Text>
          {children}
          <Hr style={{ borderColor: "#E6D5E4", margin: "24px 0" }} />
          <Text style={{ color: "#7A5478", fontSize: "12px", margin: "0" }}>
            Sanaa Glam, Berlin, Germany
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ margin: "0 0 8px", color: "#3D2B3A", fontSize: "14px" }}>
      <strong>{label}:</strong> {value}
    </Text>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Section style={{ marginTop: "18px", marginBottom: "10px" }}>
      <Button
        href={href}
        style={{
          backgroundColor: brand.peach,
          color: brand.plumDark,
          borderRadius: "999px",
          fontWeight: "600",
          textDecoration: "none",
          padding: "12px 18px",
          display: "inline-block",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}

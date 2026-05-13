import { useLogin, useIsAuthenticated } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { Navigate } from "react-router";

export const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const { data: auth, isLoading } = useIsAuthenticated();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (auth?.authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: 24,
      }}
    >
      <Card style={{ width: 400, maxWidth: "100%" }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Mafateeh Admin
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: "center" }}>
          Sign in with your admin account
        </Typography.Paragraph>
        <Form
          layout="vertical"
          onFinish={(values: { email: string; password: string }) =>
            login({ email: values.email, password: values.password })
          }
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

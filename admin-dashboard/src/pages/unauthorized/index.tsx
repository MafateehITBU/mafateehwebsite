import { Button, Result } from "antd";
import { useNavigate } from "react-router";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <Result
        status="403"
        title="Access denied"
        subTitle="You do not have permission to access this page."
        extra={
          <Button type="primary" onClick={() => navigate("/", { replace: true })}>
            Back to dashboard
          </Button>
        }
      />
    </div>
  );
};

import { Grid, Loader } from "semantic-ui-react";

export function RenderItem() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }
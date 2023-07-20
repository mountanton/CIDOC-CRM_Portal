import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultComponent } from "./shared/standalone-components/default/default.component";
import { HeaderComponent } from "./shared/standalone-components/header/header.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "datasets",
        loadComponent: () =>
          import("./features/main-page/main-page.component").then(
            (m) => m.MainPageComponent
          ),
        children: [
          {
            path: "chart",
            loadComponent: () =>
              import(
                "./features/main-page/main-page-chart/main-page-chart.component"
              ).then((m) => m.MainPageChartComponent),
          },
          {
            path: "table",
            loadComponent: () =>
              import(
                "./features/main-page/main-page-table/main-page-table.component"
              ).then((m) => m.MainPageTableComponent),
          },
        ],
      },
      {
        path: "globalSearch",
        loadComponent: () =>
          import("./features/global-search/global-search/global-search.component").then(
            (m) => m.GlobalSearchComponent
          ),
      },
      {
        path: "dataset-details/:id",
        loadComponent: () =>
          import("./features/database-details/database-details.component").then(
            (m) => m.DatabaseDetailsComponent
          ),
        children: [
          {
            path: "properties",
            loadComponent: () =>
              import(
                "./features/database-details/database-properties/database-properties.component"
              ).then((m) => m.DatabasePropertiesComponent),
          },
          {
            path: "properties/cidoc-crm",
            loadComponent: () =>
              import(
                "./features/database-details/database-properties/database-properties.component"
              ).then((m) => m.DatabasePropertiesComponent),
          },
          {
            path: "classes",
            loadComponent: () =>
              import(
                "./features/database-details/database-classes/database-classes.component"
              ).then((m) => m.DatabaseClassesComponent),
          },
          {
            path: "classes/cidoc-crm",
            loadComponent: () =>
              import(
                "./features/database-details/database-classes/database-classes.component"
              ).then((m) => m.DatabaseClassesComponent),
          },
          {
            path: "common",
            loadComponent: () =>
              import(
                "./features/common-elements/common-elements/common-elements.component"
              ).then((m) => m.CommonElementsComponent),
          },
        ],
      },
      {
        path: "common",
        loadComponent: () =>
          import(
            "./features/common-elements/common-elements/common-elements.component"
          ).then((m) => m.CommonElementsComponent),
      },
      {
        path: "dataset/add",
        loadComponent: () =>
          import("./features/mainForm/mainForm.component").then(
            (m) => m.MainFormComponent
          ),
      },
      {
        path: "about",
        loadComponent: () =>
          import("./features/about-page/about-page.component").then(
            (m) => m.AboutPageComponent
          ),
      },
      //mostFrequent
      {
        path: "mostFrequent",
        loadComponent: () =>
          import("./features/most-Frequent/most-frequent/most-frequent.component").then(
            (m) => m.MostFrequentComponent
          ),
        children: [
          {
            path: "properties",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-property/most-frequent-property.component"
              ).then((m) => m.MostFrequentPropertyComponent),
          },
          {
            path: "properties/cidoc-crm",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-property/most-frequent-property.component"
              ).then((m) => m.MostFrequentPropertyComponent),
          },
          {
            path: "properties/instances",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-property/most-frequent-property.component"
              ).then((m) => m.MostFrequentPropertyComponent),
          },
          {
            path: "properties/cidoc-crm/instances",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-property/most-frequent-property.component"
              ).then((m) => m.MostFrequentPropertyComponent),
          },
          {
            path: "classes",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-class/most-frequent-class.component"
              ).then((m) => m.MostFrequentClassComponent),
          },
          {
            path: "classes/cidoc-crm",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-class/most-frequent-class.component"
              ).then((m) => m.MostFrequentClassComponent),
          },
          {
            path: "classes/instances",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-class/most-frequent-class.component"
              ).then((m) => m.MostFrequentClassComponent),
          },
          {
            path: "classes/cidoc-crm/instances",
            loadComponent: () =>
              import(
                "./features/most-Frequent/most-frequent-class/most-frequent-class.component"
              ).then((m) => m.MostFrequentClassComponent),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

# CIDOC-CRM_Portal

This page contains the code for the CIDOC-CRM web portal (both for the backend and the frontends) 
and below all the SPARQL queries 
thar are used for A) creating the statistics and B) for all the modes of the portal


## A. SPARQL Queries for Creating the VoID Statistics for a given SPARQL Endpoint

Below, we provide the different SPARQL queries that we sent to <https://triplydb.com/smithsonian/american-art-museum/sparql/american-art-museum>,
for creating the 5,000 single-entity factoid question.

```sparql
PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  
```

1. SPARQL Query for all the triples of a Dataset (void:triples)

```sparql
SELECT (COUNT(*) AS ?no)  { ?s ?p ?o }
```

2. SPARQL Query for all the entities of a Dataset (void:entities)

```sparql
SELECT (COUNT(distinct ?s) AS ?no) { ?s a [] }
```

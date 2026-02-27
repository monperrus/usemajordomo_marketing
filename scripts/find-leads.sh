#!/bin/bash

# $49 a month
export APOLLO_API_KEY=
# Find founders at early-stage startups
curl -X POST https://api.apollo.io/v1/mixed_people/search \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $APOLLO_API_KEY" \
  -d '{
    "q_organization_num_employees_ranges": ["1,10", "11,20"],
    "person_titles": ["Founder", "CEO", "Co-Founder"],
    "person_locations": ["United States"],
    "page": 1,
    "per_page": 100
  }' | jq '.people[] | {name: .first_name, email: .email, company: .organization.name}' \
  >> leads.json

# Enrich with additional data
curl -X POST https://api.apollo.io/v1/people/match \
  -H "X-Api-Key: $APOLLO_API_KEY" \
  -d @leads.json \
  >> enriched-leads.json

echo "Found $(jq length enriched-leads.json) leads"

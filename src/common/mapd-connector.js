import MapDCon from '@mapd/connector/dist/browser-connector';

// create mapd connector instance to establish data connection 
const connector = new window.MapdCon();
let connection = null;

function connect(config) {
  return new Promise((resolve, reject) => {
    connector
      .host(config.host)
      .port(config.port)
      .dbName(config.database)
      .user(config.username)
      .password(config.password)
      .connect((error, connection) => {
        if (error) {
          reject(error);
        } else if (connection) {
          console.log('mapd-connector:connection:', connection);
          resolve(connection);
        }
      })
  })
}

async function getConnection(config) {
  try {
    return await connect(config);
  } catch(error) {
    return error;
  }
}

async function getConnectionStatus(connection) {
  try {
    return await connection.getStatusAsync();
  } catch(error) {
    return error;
  }
}

function saveConnection(mapdConnection) {
  connection = mapdConnection;
  logTables();
}

async function logTables() {
  const tables = await connection.getTablesAsync();
  console.log('mapd-connector:tables:', tables);
  // log all tables fields
  // tables.map(table => logFields(table.name));
  // TODO: comment this out for prod/demo deploy
  // log fields only for the tables used by this app
  // logFields('fire_perim_camp');
  // logFields('ca_butte_county_parcels');
  // logFields('ca_butte_county_damaged_buildings_earliestdate');
  // logFields('ca_butte_county_damaged_points_earliestdate');
}

async function logFields(tableName) {
  const tableFields = await connection.getFieldsAsync(tableName);  
  console.log(`mapd-connector:fields: (${tableName})`, tableFields);
}

async function getData(query) {
  // console.log('mapd-connector:getData: query:', query);
  return await connection.queryAsync(query);
}

async function renderVega (vegaSpec, vegaOptions = {returnTiming: true}) {
  return await new Promise((resolve, reject) => {
    connection.renderVega(1, JSON.stringify(vegaSpec), vegaOptions, function(error, result) {
      if (error) {
        reject(error.message);
      } else {
        console.log('mapd-connector:renderVega: exe:', result.execution_time_ms,
          'render:', result.render_time_ms, 'total:', result.total_time_ms, '(ms)');
        const blobUrl = `data:image/png;base64,${result.image}`;
        resolve(blobUrl);
      }
    })
  });
}

export {
  getConnection,
  getConnectionStatus,
  saveConnection,
  getData,
  renderVega
};

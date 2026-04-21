function GetMap()
    {
        var map = new Microsoft.Maps.Map('#myMap', {
        credentials: mapToken,
        center: new Microsoft.Maps.Location(34.53193000, 74.26605000),
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        zoom: 10
        });
        //Add your post map load code here.
    }